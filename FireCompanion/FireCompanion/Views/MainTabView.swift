import SwiftUI

struct MainTabView: View {
    @Environment(AppStore.self) var store

    var body: some View {
        TabView {
            Tab(store.t("dashboard"), systemImage: "chart.line.uptrend.xyaxis") {
                DashboardView()
            }
            Tab(store.t("checkins"), systemImage: "plus.circle") {
                CheckinsView()
            }
            Tab(store.t("insights"), systemImage: "lightbulb") {
                InsightsView()
            }
            Tab(store.t("settings"), systemImage: "gear") {
                SettingsView()
            }
        }
    }
}
