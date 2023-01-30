use tauri::{App, AppHandle, Manager, api::process::{Command}};
use crate::{core::*};

pub fn resolve_setup(app: &mut App) {
    #[cfg(target_os = "macos")]
    app.set_activation_policy(tauri::ActivationPolicy::Accessory);

    // start api server
    tauri::async_runtime::spawn(async move {
        Command::new_sidecar("app")
            .expect("failed to setup `app` sidecar")
            .spawn()
            .expect("Failed to spawn packaged node");
    });
    tray::Tray::update_systray(&app.app_handle()).expect("TODO: panic message");
}