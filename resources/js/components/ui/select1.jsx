import * as React from "react";
import { ChevronDown } from "lucide-react";

const Select = ({ value, onValueChange, children, disabled }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value);
    const selectRef = React.useRef(null);

    React.useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (newValue) => {
        setSelectedValue(newValue);
        onValueChange(newValue);
        setIsOpen(false);
    };

    return (
        <div ref={selectRef} className="relative">
            {React.Children.map(children, (child) => {
                if (child.type === SelectTrigger) {
                    return React.cloneElement(child, {
                        onClick: () => !disabled && setIsOpen(!isOpen),
                        disabled,
                        isOpen,
                        selectedValue
                    });
                }
                if (child.type === SelectContent && isOpen) {
                    return React.cloneElement(child, {
                        onSelect: handleSelect,
                        selectedValue
                    });
                }
                return null;
            })}
        </div>
    );
};

const SelectTrigger = ({ children, onClick, disabled, isOpen, selectedValue, className }) => {
    const selectedChild = React.Children.toArray(children).find(
        (child) => child.type === SelectValue
    );

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
        >
            {selectedChild}
            <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
    );
};

const SelectValue = ({ placeholder, children }) => {
    return <span>{children || placeholder}</span>;
};

const SelectContent = ({ children, onSelect, selectedValue, className }) => {
    return (
        <div className={`absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto ${className || ''}`}>
            {React.Children.map(children, (child) => {
                if (child.type === SelectItem) {
                    return React.cloneElement(child, {
                        onSelect,
                        isSelected: child.props.value === selectedValue
                    });
                }
                return child;
            })}
        </div>
    );
};

const SelectItem = ({ value, children, onSelect, isSelected }) => {
    return (
        <div
            onClick={() => onSelect(value)}
            className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-3 text-sm outline-none hover:bg-gray-100 ${
                isSelected ? 'bg-primary-50 text-primary-600 font-medium' : ''
            }`}
        >
            {children}
        </div>
    );
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
