import SwiftUI

struct MainTabView: View {
    @Environment(AppStore.self) var store
    @Environment(\.horizontalSizeClass) var sizeClass

    var body: some View {
        if sizeClass == .compact {
            compactLayout
        } else {
            regularLayout
        }
    }

    private var compactLayout: some View {
        TabView {
            NavigationStack {
                DashboardView()
            }
            .tabItem {
                Label(store.t("dashboard"), systemImage: "chart.line.uptrend.xyaxis")
            }

            NavigationStack {
                CheckinsView()
            }
            .tabItem {
                Label(store.t("checkins"), systemImage: "plus.circle")
            }

            NavigationStack {
                InsightsView()
            }
            .tabItem {
                Label(store.t("insights"), systemImage: "lightbulb")
            }

            NavigationStack {
                SettingsView()
            }
            .tabItem {
                Label(store.t("settings"), systemImage: "gear")
            }
        }
    }

    private var regularLayout: some View {
        NavigationSplitView {
            List {
                NavigationLink {
                    DashboardView()
                } label: {
                    Label(store.t("dashboard"), systemImage: "chart.line.uptrend.xyaxis")
                }

                NavigationLink {
                    CheckinsView()
                } label: {
                    Label(store.t("checkins"), systemImage: "plus.circle")
                }

                NavigationLink {
                    InsightsView()
                } label: {
                    Label(store.t("insights"), systemImage: "lightbulb")
                }

                NavigationLink {
                    SettingsView()
                } label: {
                    Label(store.t("settings"), systemImage: "gear")
                }
            }
            .navigationTitle(store.t("appName"))
        } detail: {
            DashboardView()
        }
    }
}
