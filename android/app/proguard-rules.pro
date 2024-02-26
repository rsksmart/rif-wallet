# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Fix Android Build crash when starting
# Ref: https://github.com/software-mansion/react-native-svg/issues/1061#issuecomment-517031073
-keep public class com.horcrux.svg.** {*;}

# keep proguard from removing reference to .env
# https://stackoverflow.com/questions/72709283/react-native-config-not-working-in-release-builds
-keep class org.iovlabs.rifWallet.BuildConfig { *; }
