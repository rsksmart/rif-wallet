import React from 'react'
import SlideUpSelect from '../SlideUpSelect'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { MediumText } from '../typography'

export type BitcoinSelectModalType = {
  items: Array<any>
  title: string
  renderKey: string
  textKeyValue: string
  onSelect: (item: any) => () => void
  shouldShow: boolean
  onClose: () => void
}
const BitcoinSelectModal: React.FC<BitcoinSelectModalType> = ({
  items,
  title,
  renderKey,
  textKeyValue,
  onSelect,
  shouldShow,
  onClose,
}) => (
  <SlideUpSelect
    title={title}
    itemsArray={items}
    renderKey={renderKey}
    RenderComponent={({ item, [textKeyValue]: renderValue }) => (
      <TouchableOpacity onPress={onSelect(item)}>
        <MediumText style={styles.whiteColor}>{renderValue}</MediumText>
      </TouchableOpacity>
    )}
    shouldShow={shouldShow}
    onClose={onClose}
  />
)

const styles = StyleSheet.create({
  whiteColor: { color: 'white' },
})
export default BitcoinSelectModal
