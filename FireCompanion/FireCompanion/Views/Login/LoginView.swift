import SwiftUI

struct LoginView: View {
    @Environment(AppStore.self) var store

    var body: some View {
        VStack(spacing: 32) {
            Spacer()

            VStack(spacing: 12) {
                Text(store.t("appName"))
                    .font(.title2)
                    .foregroundStyle(.secondary)
                Text(store.t("heroTitle") + store.t("heroSubtitle"))
                    .font(.largeTitle.bold())
                    .multilineTextAlignment(.center)
                Text(store.t("heroBody"))
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
            }

            QuickCalcView()

            VStack(spacing: 12) {
                Button {
                    store.signInDemo()
                } label: {
                    Text(store.t("continueGoogle"))
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(.black)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                }

                Button {
                    store.signInDemo()
                } label: {
                    Text(store.t("continueApple"))
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(.gray.opacity(0.15))
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                }
            }
            .padding(.horizontal, 32)

            Spacer()
        }
        .padding()
    }
}
