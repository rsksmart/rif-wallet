import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import RNModal from 'react-native-modal'

interface ModalProps {
  isVisible: boolean
  children: React.ReactNode
}

interface ModalChildrenProps {
  children: React.ReactNode
  style?: ViewStyle
}

export const Modal = ({
  isVisible = false,
  children,
  ...props
}: ModalProps) => (
  <RNModal
    isVisible={isVisible}
    animationIn="fadeIn"
    animationOut="fadeOut"
    animationInTiming={200}
    animationOutTiming={200}
    {...props}>
    {children}
  </RNModal>
)

const ModalContainer = ({ children, style = {} }: ModalChildrenProps) => (
  <View style={{ ...styles.container, ...style }}>{children}</View>
)

const ModalHeader = ({ title }: { title: string }) => (
  <View style={styles.header}>
    <Text style={styles.text}>{title}</Text>
  </View>
)

const ModalBody = ({ children, style = {} }: ModalChildrenProps) => (
  <View style={{ ...styles.body, ...style }}>{children}</View>
)

const ModalFooter = ({ children, style = {} }: ModalChildrenProps) => (
  <View style={{ ...styles.footer, ...style }}>{children}</View>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    padding: 15,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 24,
  },
  body: {
    justifyContent: 'center',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    flexDirection: 'row',
  },
})

Modal.Header = ModalHeader
Modal.Container = ModalContainer
Modal.Body = ModalBody
Modal.Footer = ModalFooter
