import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { StyleSheet, Text, View } from 'react-native'
import { TokenImage } from '../home/TokenImage'
import { shortAddress, trimValue } from '../../lib/utils'
import { StatusIcon } from '../../components/statusIcons'
import { colors } from '../../styles'
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
  <TouchableOpacity onPress={onPress} testID={`${id}.Button`}>
    <View style={styles.container}>
      <View style={styles.firstHalf}>
        <View style={styles.firstRow}>
          <TokenImage symbol={symbol || ''} width={30} height={32} />
        </View>
        <View style={styles.secondRow}>
          <Text style={styles.mainText}>To: {shortAddress(to, 3)}</Text>
          <Text style={styles.secondaryText}>{timeHumanFormatted}</Text>
        </View>
      </View>
      <View style={styles.secondHalf}>
        <View style={styles.alignSelfCenter}>
          <Text style={[styles.mainText, styles.alignSelfEnd]}>
            {trimValue(value)}
          </Text>
          {/* @TODO get value of transaction $$ for example $ 731.03*/}
          {/* <Text style={[styles.secondaryText]}></Text> */}
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
