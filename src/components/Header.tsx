import { View, Text, StyleSheet, Platform } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

import { User } from '../api/auth';
import colors from '../config/colors';
import defaultStyle from '../config/style';
import NumberFormat from '../utility/numberFormat';
import numberOrdinal from '../utility/numberOrdinal';

const Header = ({ user }: { user: User }) => {
	return (
		<View style={[styles.container, defaultStyle.rtlRow]}>
			<View style={[defaultStyle.rtlRow, styles.nameContainer]}>
				{user.nation?.name && (
					<View style={[styles.flag, defaultStyle.marginEndRtl(8)]}>
						<Text style={styles.flagText}>{user.nation?.flag}</Text>
					</View>
				)}
				<View>
					<Text
						style={
							styles.name
						}>{`${user.firstName} ${user.lastName}`}</Text>
					{user.nation?.name && (
						<Text style={styles.from}>{user.nation?.name}</Text>
					)}
				</View>
			</View>
			<View>
				<View style={[defaultStyle.rtlRow, styles.rankContainer]}>
					<FontAwesome5
						name='medal'
						color={colors.yellow}
						size={18}
					/>
					<Text style={styles.rank}>{numberOrdinal(user?.rank)}</Text>
				</View>
				<View style={defaultStyle.rtlRow}>
					<MaterialCommunityIcons
						name='trophy-award'
						color={colors.white}
						size={18}
					/>
					<Text style={styles.points}>{`${NumberFormat(
						user.points?.total
					)} ${user.points?.total === 1 ? 'point' : 'points'}`}</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 70,
		paddingHorizontal: 20,
		backgroundColor: colors.primary,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	nameContainer: {
		alignItems: 'center',
	},
	name: {
		fontSize: 16,
		fontWeight: 'bold',
		color: colors.white,
	},
	from: {
		paddingVertical: 2,
		color: colors.white,
	},
	rankContainer: {
		marginBottom: 3,
	},
	rank: {
		fontWeight: 'bold',
		fontSize: 16,
		color: colors.yellow,
	},
	points: {
		color: colors.white,
	},
	flag: {
		backgroundColor: colors.white,
		height: 40,
		width: 40,
		borderRadius: 20,
		borderColor: colors.medium,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	flagText: {
		fontSize: Platform.OS === 'android' ? 20 : 24,
		paddingBottom: Platform.OS === 'android' ? 2 : 0,
	},
});

export default Header;
