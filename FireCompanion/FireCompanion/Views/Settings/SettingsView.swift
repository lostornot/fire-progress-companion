import SwiftUI

struct SettingsView: View {
    @Environment(AppStore.self) var store

    var body: some View {
        @Bindable var store = store
        ScrollView {
            VStack(spacing: 24) {
                statusSection
                languageSection(store: $store)
                currencySection(store: $store)
                withdrawalRateSection(store: $store)
                actionsSection
            }
            .padding()
        }
        .navigationTitle(store.t("settings"))
    }

    private var statusSection: some View {
        Group {
            if store.session != nil {
                Label(store.t("signedInStatus"), systemImage: "checkmark.circle.fill")
                    .foregroundStyle(.green)
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color.green.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            } else {
                Label(store.t("demoModeStatus"), systemImage: "info.circle")
                    .foregroundStyle(.secondary)
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(.gray.opacity(0.08))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            }
        }
    }

    private func languageSection(store: Bindable<AppStore>) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(store.t("language"))
                .font(.headline)
            Picker("Language", selection: store.settings.language) {
                Text("中文").tag(Language.zh)
                Text("English").tag(Language.en)
            }
            .pickerStyle(.segmented)
        }
        .padding()
        .background(.gray.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private func currencySection(store: Bindable<AppStore>) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(store.t("currency"))
                .font(.headline)
            Picker("Currency", selection: store.settings.currency) {
                Text("CNY (¥)").tag(Currency.cny)
                Text("USD ($)").tag(Currency.usd)
            }
            .pickerStyle(.segmented)
        }
        .padding()
        .background(.gray.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private func withdrawalRateSection(store: Bindable<AppStore>) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(store.wrappedValue.t("defaultWithdrawalRate"))
                .font(.headline)
            HStack {
                Slider(value: store.settings.defaultWithdrawalRate, in: 0.02...0.1, step: 0.005)
                Text(Formatters.percent(store.wrappedValue.settings.defaultWithdrawalRate, lang: store.wrappedValue.lang))
                    .monospacedDigit()
            }
        }
        .padding()
        .background(.gray.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private var actionsSection: some View {
        VStack(spacing: 12) {
            if store.session != nil {
                Button {
                    store.signOut()
                } label: {
                    Text(store.t("signOut"))
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(.black)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                }
            }

            Button {
                store.resetDemo()
            } label: {
                Text(store.t("resetDemo"))
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.orange)
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
            }
        }
    }
}
