import SwiftUI

@main
struct FireCompanionApp: App {
    @State private var store = AppStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
        }
    }
}

struct ContentView: View {
    @Environment(AppStore.self) var store

    var body: some View {
        if !store.ready {
            ProgressView()
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .onAppear { store.bootstrap() }
        } else if store.session != nil {
            MainTabView()
        } else {
            LoginView()
        }
    }
}
