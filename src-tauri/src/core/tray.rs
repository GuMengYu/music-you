use crate::{utils::resolve, core::handle};
use anyhow::Result;

use tauri::{api, AppHandle, CustomMenuItem, Manager, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, SystemTraySubmenu};

pub struct Tray {}

impl Tray {
    pub fn tray_menu(app_handle: &AppHandle) -> SystemTrayMenu {

        let version = app_handle.package_info().version.to_string();

        SystemTrayMenu::new()
            .add_item(CustomMenuItem::new("open_window", "打开面板"))
            .add_native_item(SystemTrayMenuItem::Separator)
            .add_item(CustomMenuItem::new("toggle_play", "播放/暂停"))
            .add_item(CustomMenuItem::new("prev_track", "上一首"))
            .add_item(CustomMenuItem::new("next_track", "下一首"))
            .add_item(CustomMenuItem::new("volume_up", "音量+"))
            .add_item(CustomMenuItem::new("volume_down", "音量-"))
            .add_item(CustomMenuItem::new("fav_track", "添加到喜欢"))
            .add_native_item(SystemTrayMenuItem::Separator)
            .add_submenu(SystemTraySubmenu::new(
                "更多",
                SystemTrayMenu::new()
                    .add_item(CustomMenuItem::new("open_setting", "打开设置"))
                    // .add_item(CustomMenuItem::new("restart_api", "重启 NetEaseApi"))
                    .add_item(CustomMenuItem::new("restart_app", "重启应用"))
                    .add_item(
                        CustomMenuItem::new("app_version", format!("Version {version}"))
                            .disabled(),
                    ),
            ))
            .add_native_item(SystemTrayMenuItem::Separator)
            .add_item(CustomMenuItem::new("quit", "退出").accelerator("CmdOrControl+Q"))
    }

    pub fn update_systray(app_handle: &AppHandle) -> Result<()> {
        app_handle
            .tray_handle()
            .set_menu(Tray::tray_menu(app_handle))?;
        Tray::update_part(app_handle)?;
        Ok(())
    }

    // 更新托盘菜单
    pub fn update_part(app_handle: &AppHandle) -> Result<()> {
        let tray = app_handle.tray_handle();

        let _ = tray.get_item("open_window").set_selected(true);

        Ok(())
    }


    pub fn on_system_tray_event(app_handle: &AppHandle, event: SystemTrayEvent) {
        match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "open_window" => resolve::create_window(app_handle),
                "toggle_play" => handle::Handle::tray_control("toggle_play".into()),
                "prev_track" => handle::Handle::tray_control("prev_track".into()),
                "next_track" => handle::Handle::tray_control("next_track".into()),
                "fav_track" => handle::Handle::tray_control("fav_track".into()),
                "open_setting" => handle::Handle::tray_control("open_setting".into()),
                "volume_up" => handle::Handle::tray_control("volume_up".into()),
                "volume_down" => handle::Handle::tray_control("volume_down".into()),
                "restart_app" => api::process::restart(&app_handle.env()),
                "quit" => {
                    api::process::kill_children();
                    app_handle.exit(0);
                    std::process::exit(0);
                }
                _ => {}
            },
            #[cfg(target_os = "windows")]
            SystemTrayEvent::LeftClick { .. } => {
                resolve::create_window(app_handle);
            }
            _ => {}
        }
    }
}
