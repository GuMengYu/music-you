use tauri::{App, AppHandle, Manager, api::process::{Command}, Wry};

#[cfg(target_os = "macos")]
use tauri_utils::TitleBarStyle;

use crate::{core::*};

pub fn resolve_setup(app: &mut App<Wry>) {
    // #[cfg(target_os = "macos")]
    // app.set_activation_policy(tauri::ActivationPolicy::Accessory);

    handle::Handle::global().init(app.app_handle());

    // start api server
    tauri::async_runtime::spawn(async move {
        Command::new_sidecar("app")
            .expect("failed to setup `app` sidecar")
            .spawn()
            .expect("Failed to spawn packaged node");
    });
    tray::Tray::update_systray(&app.app_handle()).expect("TODO: panic message");
    create_window(&app.app_handle())
}

/// create main window
pub fn create_window(app_handle: &AppHandle) {
    if let Some(window) = app_handle.get_window("main") {
        let _ = window.unminimize();
        let _ = window.show();
        let _ = window.set_focus();
        return;
    }

    let builder = tauri::window::WindowBuilder::new(
        app_handle,
        "main".to_string(),
        tauri::WindowUrl::App("index.html".into()),
    )
        .resizable(true)
        .title("Music You Tauri")
        .center()
        .fullscreen(false)
        .min_inner_size(393.0, 600.0);

    #[cfg(target_os = "windows")]
    {
        use std::time::Duration;
        use tokio::time::sleep;
        use window_shadows::set_shadow;

        match builder
            .decorations(false)
            .transparent(true)
            .inner_size(1200.0, 700.0)
            .visible(false)
            .build()
        {
            Ok(_) => {
                let app_handle = app_handle.clone();

                if let Some(window) = app_handle.get_window("main") {
                    let _ = set_shadow(&window, true);
                }

                tauri::async_runtime::spawn(async move {
                    sleep(Duration::from_secs(1)).await;

                    if let Some(window) = app_handle.get_window("main") {
                        let _ = window.show();
                        let _ = window.unminimize();
                        let _ = window.set_focus();
                    }
                });
            }
            Err(err) => log::error!(target: "app", "{err}"),
        }
    }

    #[cfg(target_os = "macos")]
    crate::log_err!(builder
        .hidden_title(true)
        .title_bar_style(TitleBarStyle::Overlay)
        .decorations(true)
        .inner_size(1200.0, 700.0)
        .build()
    );

    #[cfg(target_os = "linux")]
    crate::log_err!(builder
        .decorations(true)
        .transparent(false)
        .inner_size(1200.0, 700.0)
        .build());

}
