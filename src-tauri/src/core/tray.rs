use crate::{utils::resolve};
use anyhow::Result;

use tauri::{
    api, AppHandle, CustomMenuItem, Manager, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
    SystemTraySubmenu,
};

pub struct Tray {}

impl Tray {
    pub fn tray_menu(app_handle: &AppHandle) -> SystemTrayMenu {

        let version = app_handle.package_info().version.to_string();

        SystemTrayMenu::new()
            .add_item(CustomMenuItem::new("open_window", "打开应用"))
            .add_native_item(SystemTrayMenuItem::Separator)
            .add_item(CustomMenuItem::new("playpause", "播放/暂停"))
            .add_item(CustomMenuItem::new("fav", "喜欢"))
            .add_native_item(SystemTrayMenuItem::Separator)
            .add_item(CustomMenuItem::new("setting", "打开设置"))
            .add_submenu(SystemTraySubmenu::new(
                "更多",
                SystemTrayMenu::new()
                    .add_item(CustomMenuItem::new("restart_api", "重启 NetEaseApi"))
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
            // SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            //     mode @ ("rule_mode" | "global_mode" | "direct_mode" | "script_mode") => {
            //         let mode = &mode[0..mode.len() - 5];
            //         feat::change_clash_mode(mode.into());
            //     }
            //
            //     "open_window" => resolve::create_window(app_handle),
            //     "system_proxy" => feat::toggle_system_proxy(),
            //     "tun_mode" => feat::toggle_tun_mode(),
            //     "restart_clash" => feat::restart_clash_core(),
            //     "restart_app" => api::process::restart(&app_handle.env()),
            //     "quit" => {
            //         resolve::resolve_reset();
            //         api::process::kill_children();
            //         app_handle.exit(0);
            //         std::process::exit(0);
            //     }
            //     _ => {}
            // },
            #[cfg(target_os = "windows")]
            SystemTrayEvent::LeftClick { .. } => {
                resolve::create_window(app_handle);
            }
            _ => {}
        }
    }
}
