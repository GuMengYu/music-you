#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod cmds;
mod utils;

use tauri::{api, api::process::{Command}, Manager, Wry};

use tauri_utils::config::{Config, WindowConfig};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command


fn main() -> std::io::Result<()> {
    println!("app start");
    let mut builder = tauri::Builder::default()
        .setup(|_app| {
            tauri::async_runtime::spawn(async move {
                Command::new_sidecar("app")
                .expect("failed to setup `app` sidecar")
                .spawn()
                .expect("Failed to spawn packaged node");
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            cmds::close_splashscreen,
            cmds::minimized,
            cmds::open_web_url,
        ]);

    let app = builder
        .build(tauri::generate_context!())
        .expect("error while running tauri application");
    app.run(|app_handle, e| match e {
        tauri::RunEvent::ExitRequested { api, .. } => {
            api.prevent_exit();
        }
        tauri::RunEvent::Exit => {
            api::process::kill_children();
            app_handle.exit(0);
        }
        #[cfg(target_os = "macos")]
        tauri::RunEvent::WindowEvent { label, event, .. } => {
            use tauri::Manager;

            if label == "main" {
                match event {
                    tauri::WindowEvent::CloseRequested { api, .. } => {
                        api.prevent_close();
                        app_handle.get_window("main").map(|win| {
                            let _ = win.hide();
                        });
                    }
                    _ => {}
                }
            }
        }
        _ => {}
    });
    Ok(())
}
