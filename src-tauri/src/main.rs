#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod cmds;
mod utils;

use tauri::{
    api::process::{Command},
  };

use tauri_utils::config::{Config, WindowConfig};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command


fn main() {
    tauri::Builder::default()
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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
