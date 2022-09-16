import React from 'react'
import SlideUpModal from './slideUpModal/SlideUpModal'
import { colors } from '../styles'

const SlideUpSelect: React.FC<{
  title: string
  itemsArray: Array<any>
  renderKey: string
  RenderComponent: React.FC<any>
  shouldShow: boolean
  onClose: () => void
}> = ({
  title,
  itemsArray,
  RenderComponent,
  renderKey,
  shouldShow,
  onClose,
}) => {
  return (
    <SlideUpModal
      title={title}
      showSelector={shouldShow}
      animateModal={false}
      onModalClosed={onClose}
      onAnimateModal={onClose}
      isKeyboardVisible={false}
      backgroundColor={colors.darkPurple3}
      headerFontColor={colors.white}>
      {itemsArray.map((item: any) => (
        <RenderComponent key={item[renderKey]} {...item} item={item} />
      ))}
    </SlideUpModal>
  )
}

export default SlideUpSelect
