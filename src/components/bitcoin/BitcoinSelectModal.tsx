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
      <TouchableOpacity onPress={onSelect(item)} style={styles.touchStyle}>
        <MediumText style={styles.whiteColor}>{renderValue}</MediumText>
      </TouchableOpacity>
    )}
    shouldShow={shouldShow}
    onClose={onClose}
  />
)

const styles = StyleSheet.create({
  whiteColor: { color: 'black' },
  touchStyle: {
    marginBottom: 30,
    height: 70,
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 20,
    backgroundColor: '#c6ccea',
  },
})
export default BitcoinSelectModal
