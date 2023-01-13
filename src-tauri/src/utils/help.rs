
#[macro_export]
macro_rules! error {
    ($result: expr) => {
        log::error!(target: "app", "{}", $result);
    };
}

#[macro_export]
macro_rules! log_err {
    ($result: expr) => {
        if let Err(err) = $result {
            log::error!(target: "app", "{err}");
        }
    };

    ($result: expr, $err_str: expr) => {
        if let Err(_) = $result {
            log::error!(target: "app", "{}", $err_str);
        }
    };
}

/// wrap the anyhow error
/// transform the error to String
#[macro_export]
macro_rules! wrap_err {
    ($stat: expr) => {
        match $stat {
            Ok(a) => Ok(a),
            Err(err) => {
                log::error!(target: "app", "{}", err.to_string());
                Err(format!("{}", err.to_string()))
            }
        }
    };
}

/// return the string literal error
#[macro_export]
macro_rules! ret_err {
    ($str: expr) => {
        return Err($str.into())
    };
}
