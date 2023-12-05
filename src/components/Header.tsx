import {
	View,
	Text,
	StyleSheet,
	Platform,
	Image,
	TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import navigation from '../navigation/rootNavigation';

import { User } from '../api/auth';
import colors from '../config/colors';
import defaultStyle from '../config/style';
import NumberFormat from '../utility/numberFormat';
import numberOrdinal from '../utility/numberOrdinal';
import routes from '../navigation/routes';

const Header = ({ user }: { user: User }) => {
	return (
		<TouchableWithoutFeedback
			onPress={() =>
				navigation.navigate(routes.PROFILE.name, {
					screen: routes.PROFILE_MAIN.name,
				})
			}>
			<View style={[styles.container, defaultStyle.rtlRow]}>
				<View style={[defaultStyle.rtlRow, styles.nameContainer]}>
					{user?.profilePic ? (
						user.nation?.name ? (
							<View
								style={[
									defaultStyle.rtlRow,
									styles.imageContainer,
								]}>
								<Image
									style={[
										styles.image,
										{ width: 60, height: 60 },
									]}
									source={{
										uri: user.profilePic as string,
									}}
								/>
								<View
									style={[
										styles.flagImg,
										defaultStyle.marginEndRtl(8),
										defaultStyle.marginStartRtl(-20),
									]}>
									<Text style={styles.flagTextImg}>
										{user.nation?.flag}
									</Text>
								</View>
							</View>
						) : (
							<Image
								style={[
									styles.image,
									{ width: 60, height: 60 },
									defaultStyle.marginEndRtl(8),
								]}
								source={{
									uri: user.profilePic as string,
								}}
							/>
						)
					) : (
						user.nation?.name && (
							<View
								style={[
									styles.flag,
									defaultStyle.marginEndRtl(8),
								]}>
								<Text style={styles.flagText}>
									{user.nation?.flag}
								</Text>
							</View>
						)
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
						<Text style={styles.rank}>
							{numberOrdinal(user?.rank)}
						</Text>
					</View>
					<View style={defaultStyle.rtlRow}>
						<MaterialCommunityIcons
							name='trophy-award'
							color={colors.white}
							size={18}
						/>
						<Text style={styles.points}>{`${NumberFormat(
							user.points?.total
						)} ${
							user.points?.total === 1 ? 'point' : 'points'
						}`}</Text>
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 80,
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
		height: 50,
		width: 50,
		borderRadius: 25,
		borderColor: colors.medium,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	flagImg: {
		backgroundColor: colors.white,
		height: 30,
		width: 30,
		borderRadius: 15,
		borderColor: colors.medium,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	flagText: {
		fontSize: Platform.OS === 'android' ? 25 : 29,
		paddingBottom: Platform.OS === 'android' ? 2 : 0,
	},
	flagTextImg: {
		fontSize: Platform.OS === 'android' ? 15 : 19,
		paddingBottom: Platform.OS === 'android' ? 2 : 0,
	},
	imageContainer: {
		justifyContent: 'center',
		alignItems: 'flex-end',
	},
	image: {
		borderRadius: 30,
		borderWidth: 1,
		borderColor: colors.white,
	},
});

export default Header;
