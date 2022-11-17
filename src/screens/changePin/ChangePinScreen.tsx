import React, { useState, useRef } from 'react'
import { PinManager } from '../../components/PinManager'
import { RootStackScreenProps } from 'navigation/rootNavigator/types'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { Arrow } from '../../components/icons'
import { MediumText } from '../../components'

type ChangePinProps = {
  editPin: any
}
const ChangePinScreen: React.FC<
  RootStackScreenProps<'ChangePinScreen'> & ChangePinProps
> = ({ editPin, navigation }) => {
  const [currentStep, setCurrentStep] = useState(1)

  const pinSteps = useRef({
    pin: '',
    confirmPin: '',
  })
  const isSubmitting = useRef(false)
  const [confirmPinTitle, setConfirmPinTitle] = useState('Confirm new PIN')
  const [pinError, setPinError] = useState('')
  const [resetPin, setResetPin] = useState(0)

  const onPinSubmit = () => {
    if (!isSubmitting.current) {
      isSubmitting.current = true
      try {
        editPin(pinSteps.current.pin).then(() => {
          setConfirmPinTitle('PIN confirmed')

          setTimeout(() => {
            navigation.goBack()
          }, 2500)
        })
      } catch (error) {
        setPinError(
          'An error occurred while saving the new PIN. Please try again.',
        )
        isSubmitting.current = false
      }
    }
  }

  const onBackPress = () => {
    setCurrentStep(1)
    setPinError('')
  }
  const onPinChange = (index: number) => async (pin: string) => {
    setPinError('')
    switch (index) {
      case 1:
        if (pin.length === 4) {
          setCurrentStep(2)
        }
        pinSteps.current = { pin, confirmPin: '' }
        break
      case 2:
        pinSteps.current = { ...pinSteps.current, confirmPin: pin }
        if (pinSteps.current.pin !== pinSteps.current.confirmPin) {
          setPinError('PINs do not match.')
          pinSteps.current.confirmPin = ''
          setResetPin(state => state + 1)
        } else {
          onPinSubmit()
        }
        break
      default:
        throw new Error('Stepper is wrong. Not implemented case detected.')
    }
    return null
  }
  const stepper: { [key: number]: any } = {
    1: <PinManager title="Enter new PIN" handleSubmit={onPinChange(1)} />,
    2: (
      <>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Arrow color="#DBE3FF" height={25} width={25} rotate={270} />
        </TouchableOpacity>
        <View style={styles.pinView}>
          <PinManager
            key={resetPin}
            title={confirmPinTitle}
            handleSubmit={onPinChange(2)}
          />
        </View>
      </>
    ),
  }
  return (
    <>
      {stepper[currentStep]}
      {pinError !== '' && (
        <View style={styles.errorView}>
          <View style={styles.errorTextContainer}>
            <MediumText style={styles.errorText}>{pinError}</MediumText>
          </View>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  backButton: {
    color: 'white',
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 5,
    backgroundColor: 'rgba(198, 204, 234, 0.5)',
    borderRadius: 40,
  },
  errorView: {
    position: 'absolute',
    width: '100%',
    top: 17,
    alignItems: 'center',
    zIndex: 4,
  },
  errorTextContainer: {
    backgroundColor: 'red',
    borderRadius: 40,
  },
  errorText: {
    color: 'white',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  pinView: {
    height: '100%',
  },
})
export default ChangePinScreen
