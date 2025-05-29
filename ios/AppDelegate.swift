import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
  
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Create a delegate conforming to RCTDefaultReactNativeFactoryDelegate
    let delegate = ReactNativeDelegate()
    // Create the factory with the delegate
    let factory = RCTReactNativeFactory(delegate: delegate)
    // Set the dependency provider (new architecture support)
    delegate.dependencyProvider = RCTAppDependencyProvider()
    
    self.reactNativeDelegate = delegate
    self.reactNativeFactory = factory
    
    // Set up window and launch React Native
    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "rifWallet",
      in: window,
      launchOptions: launchOptions
    )
    
    return true
  }
}

// ReactNativeDelegate implementing sourceURL and bundleURL
class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge!) -> URL! {
    return self.bundleURL()
  }

  override func bundleURL() -> URL! {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
