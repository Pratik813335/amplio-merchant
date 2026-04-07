const DEFAULT_SET_VALUE_OPTIONS = {
  shouldValidate: true,
  shouldDirty: true,
  shouldTouch: true,
};

export function applyAutofillValues(setValue, values, setValueOptions = DEFAULT_SET_VALUE_OPTIONS) {
  Object.entries(values).forEach(([fieldName, fieldValue]) => {
    if (typeof fieldValue === 'undefined') {
      return;
    }

    setValue(fieldName, fieldValue, setValueOptions);
  });
}

export function resolveOptionValue({
  options = [],
  desiredLabel,
  valueKey = 'id',
  labelKeys = ['label', 'name', 'value'],
  fallbackToFirst = false,
}) {
  const hasUsableValue = (value) => value !== undefined && value !== null && value !== '';

  if (!Array.isArray(options) || options.length === 0) {
    return '';
  }

  const normalizedDesiredLabel = String(desiredLabel || '')
    .trim()
    .toLowerCase();

  const match = options.find((option) => {
    if (!option) {
      return false;
    }

    return labelKeys.some((labelKey) => {
      const optionLabel = option?.[labelKey];

      return (
        typeof optionLabel !== 'undefined' &&
        String(optionLabel).trim().toLowerCase() === normalizedDesiredLabel
      );
    });
  });

  if (hasUsableValue(match?.[valueKey])) {
    return match[valueKey];
  }

  if (fallbackToFirst) {
    return options.find((option) => hasUsableValue(option?.[valueKey]))?.[valueKey] || '';
  }

  return '';
}
