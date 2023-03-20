import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { shortAddress, trimValue } from 'lib/utils'

import { StatusIcon } from 'components/statusIcons'
import { RegularText } from 'src/components'
import { colors } from 'src/styles'

import { TokenImage } from '../home/TokenImage'
import { ActivityRowPresentationType } from './types'

const StatusBackgroundColorMap = {
  success: {
    color: 'black',
    background: {
      backgroundColor: '#00D8A6',
    },
  },
  pending: {
    color: 'red',
    background: {
      backgroundColor: 'white',
    },
  },
}

const ActivityRowPresentation: React.FC<ActivityRowPresentationType> = ({
  onPress,
  symbol,
  to,
  timeHumanFormatted,
  value,
  status,
  id,
}) => (
  <TouchableOpacity
    onPress={onPress}
    testID={`${id}.Button`}
    accessibilityLabel={`${id}.Button`}>
    <View style={styles.container}>
      <View style={styles.firstHalf}>
        <View style={styles.firstRow}>
          <TokenImage symbol={symbol || ''} width={30} height={32} />
        </View>
        <View style={styles.secondRow}>
          <RegularText style={styles.mainText}>
            To: {shortAddress(to, 3)}
          </RegularText>
          <RegularText style={styles.secondaryText}>
            {timeHumanFormatted}
          </RegularText>
        </View>
      </View>
      <View style={styles.secondHalf}>
        <View style={styles.alignSelfCenter}>
          <RegularText style={[styles.mainText, styles.alignSelfEnd]}>
            {trimValue(value)}
          </RegularText>
          {/* @TODO get value of transaction $$ for example $ 731.03*/}
          {/* <RegularText style={[styles.secondaryText]}></RegularText> */}
        </View>
        <View style={[styles.mr3, styles.ml10, styles.alignSelfCenter]}>
          <View
            style={[
              styles.backgroundStatus,
              StatusBackgroundColorMap[status].background,
            ]}>
            <StatusIcon
              status={status}
              color={StatusBackgroundColorMap[status].color}
              width={20}
              height={20}
            />
          </View>
        </View>
      </View>
    </View>
  </TouchableOpacity>
)

// @TODO use the colors in colors.js
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    backgroundColor: colors.background.primary,
    borderRadius: 20,
    marginTop: 18,
  },
  white: {
    color: 'white',
  },
  mainText: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  secondaryText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  firstHalf: {
    flexGrow: 50,
    flexDirection: 'row',
  },
  secondHalf: {
    flexGrow: 50,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  firstRow: {
    color: 'white',
    borderRadius: 40,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginRight: 15,
    marginLeft: 5,
  },
  secondRow: {
    flexGrow: 20,
  },
  thirdRow: {
    flexGrow: 90,
  },
  fourthRow: {
    flexGrow: 10,
  },
  icon: {
    borderRadius: 20,
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  alignSelfEnd: {
    alignSelf: 'flex-end',
  },
  ml10: { marginLeft: 10 },
  mr3: { marginRight: 3 },
  backgroundStatus: {
    borderRadius: 20,
  },
})

export default ActivityRowPresentation
