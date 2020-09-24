import React, {
  ChangeEvent,
  KeyboardEvent,
  FC,
  ReactElement,
  useEffect,
  useState,
  useRef,
} from "react";
import Input, { InputProps } from "../Input/input";
import Transition from "../Transition/transition";
import Icon from "../Icon/icon";
import classNames from "classnames";
import useDebounce from "../../hooks/useDebounce";
import useClickOutside from "../../hooks/useClickOutside";

interface DataSourceObject {
  value: string;
}
export type DataSourceType<T = {}> = T & DataSourceObject;
export interface AutoCompleteProps extends Omit<InputProps, "onSelect"> {
  fetchSuggestions: (
    str: string
  ) => DataSourceType[] | Promise<DataSourceType[]>;
  onSelect?: (item: DataSourceType) => void;
  renderOption?: (item: DataSourceType) => ReactElement;
}

const AutoComplete: FC<AutoCompleteProps> = (props) => {
  const {
    fetchSuggestions,
    onSelect,
    value,
    renderOption,
    ...restProps
  } = props;
  const [inputValue, setInputValue] = useState(value as string);
  const [suggestions, setSugestions] = useState<DataSourceType[]>([]);
  const [loading, setLoading] = useState(false); // 加载中动画
  const [showDropdown, setShowDropdown] = useState(false); // 是否展示下拉列表
  const [highlightIndex, setHighlightIndex] = useState(-1); // 高亮
  const componentRef = useRef<HTMLDivElement>(null);

  const debouncedValue = useDebounce(inputValue, 500); // 防抖 0.5秒后改变debouncedValue 用于防抖
  // 即使有防抖但选中一项时依然会重置inputValue，
  // 然后0.5后依然改变了debouncedValue ，triggerSearch会一直保持引用到组件卸载
  const triggerSearch = useRef(false);
  // 如果点击了组件外就收起来呢
  useClickOutside(componentRef, () => {
    setSugestions([]);
  });

  // 输入变化
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(value);
    triggerSearch.current = true;
  };

  const handleSelect = (item: DataSourceType) => {
    setInputValue(item.value);
    setShowDropdown(false);
    if (onSelect) {
      onSelect(item);
    }
    triggerSearch.current = false;
  };

  // inputValue 改变去做的事情有异步的 是一个副作用 放到effect里最好
  useEffect(() => {
    // 防抖 + 选中后排除无效的搜索
    if (debouncedValue && triggerSearch.current) {
      setSugestions([]);
      const results = fetchSuggestions(inputValue);
      console.log(results);
      if (results instanceof Promise) {
        setLoading(true);
        results.then((data) => {
          setLoading(false);
          setSugestions(data);
          if (data.length > 0) {
            setShowDropdown(true);
          }
        });
      } else {
        setSugestions(results);
        if (results.length > 0) {
          setShowDropdown(true);
        }
      }
    }
    setHighlightIndex(-1);
  }, [debouncedValue, fetchSuggestions]);

  // 内部判断是否需要传入的渲染模板
  const renderTemplate = (item: DataSourceType) => {
    return renderOption ? renderOption(item) : item.value;
  };

  const generateDropdown = () => {
    return (
      <Transition
        in={showDropdown || loading}
        animation="zoom-in-top"
        timeout={300}
        onExited={() => {
          setSugestions([]);
        }}
      >
        <ul className="viking-suggestion-list">
          {loading && (
            <div className="suggstions-loading-icon">
              <Icon icon="spinner" spin />
            </div>
          )}
          {suggestions.map((item, index) => {
            const cnames = classNames("suggestion-item", {
              "is-active": index === highlightIndex,
            });
            return (
              <li
                key={index}
                className={cnames}
                onClick={() => handleSelect(item)}
              >
                {renderTemplate(item)}
              </li>
            );
          })}
        </ul>
      </Transition>
    );
  };

  const highlight = (index: number) => {
    if (index < 0) index = 0;
    if (index >= suggestions.length) {
      index = suggestions.length - 1;
    }
    setHighlightIndex(index);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.keyCode) {
      case 13:
        if (suggestions[highlightIndex]) {
          handleSelect(suggestions[highlightIndex]);
        }
        break;
      case 38:
        highlight(highlightIndex - 1);
        break;
      case 40:
        highlight(highlightIndex + 1);
        break;
      case 27:
        setShowDropdown(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="viking-auto-complete" ref={componentRef}>
      <Input
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...restProps}
      />
      {generateDropdown()}
    </div>
  );
};

export default AutoComplete;
