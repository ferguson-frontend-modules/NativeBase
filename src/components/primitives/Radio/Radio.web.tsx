import React from 'react';
import Icon from '../Icon';
import Box from '../Box';
import { Center } from '../../composites/Center';
import { usePropsResolution } from '../../../hooks/useThemeProps';
import type { IRadioProps } from './types';
import { mergeRefs } from './../../../utils';
import { useHover } from '@react-native-aria/interactions';
import { useRadio } from '@react-native-aria/radio';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { RadioContext } from './RadioGroup';
import { useFocusRing } from '@react-native-aria/focus';

const Radio = ({ icon, children, ...props }: IRadioProps, ref: any) => {
  const contextState = React.useContext(RadioContext);
  const {
    _interactionBox: {
      _hover: _iterationBoxHover,
      _focus: _iterationBoxFocus,
      _disabled: _iterationBoxDisabled,
      ..._interactionBox
    },
    _radio: {
      _checked: _radioChecked,
      _disabled: _radioDisabled,
      _invalid: _radioInvalid,
      ..._radio
    },
    _icon,
    isInvalid,
    iconSize,
    ...themedProps
  } = usePropsResolution('Radio', {
    ...contextState,
    ...props,
  });

  const inputRef = React.useRef(null);
  const { inputProps } = useRadio(props, contextState.state, inputRef);
  const { disabled, checked } = inputProps;

  const _ref = React.useRef(null);
  const { isHovered } = useHover({}, _ref);
  const mergedRefs = mergeRefs([_ref, ref]);
  const { focusProps, isFocusVisible } = useFocusRing();

  // only calling below function when icon exist.
  const sizedIcon = () =>
    //@ts-ignore
    React.cloneElement(icon, {
      iconSize,
      ..._icon,
    });

  const component = (
    <Box
      flexDirection="row"
      alignItems="center"
      {...themedProps}
      opacity={disabled ? 0.4 : 1}
      cursor={disabled ? 'not-allowed' : 'pointer'}
    >
      <Center>
        {/* Interaction Box */}
        <Box
          {..._interactionBox}
          {...(isFocusVisible && _iterationBoxFocus)}
          {...(isHovered && _iterationBoxHover)}
          {...(disabled && _iterationBoxDisabled)}
          style={{
            // @ts-ignore - only for web"
            transition: 'height 200ms, width 200ms',
          }}
          h={isFocusVisible || isHovered ? '200%' : '100%'}
          w={isFocusVisible || isHovered ? '200%' : '100%'}
        />
        {/* Radio */}
        <Center
          {..._radio}
          {...(checked && _radioChecked)}
          {...(disabled && _radioDisabled)}
          {...(isInvalid && _radioInvalid)}
        >
          {icon && sizedIcon && checked ? (
            sizedIcon()
          ) : (
            <Icon
              name="circle"
              {..._icon}
              size={iconSize}
              opacity={checked ? 1 : 0}
            />
          )}
        </Center>
      </Center>
      {children}
    </Box>
  );

  return (
    <Box
      // @ts-ignore - RN web supports accessibilityRole="label"
      accessibilityRole="label"
      ref={mergedRefs}
    >
      <VisuallyHidden>
        <input {...inputProps} ref={ref} {...focusProps} />
      </VisuallyHidden>
      {component}
    </Box>
  );
};

export default React.memo(React.forwardRef(Radio));
