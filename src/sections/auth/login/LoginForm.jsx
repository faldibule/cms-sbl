import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, IconButton, InputAdornment, Typography, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '@components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '@components/hook-form';
import http from '@variable/Api';
import { useSetRecoilState } from 'recoil';
import { authentication } from '@recoil/Authentication';
import useShowFile from '@hooks/file-management/useShowFile';

// ----------------------------------------------------------------------

export default function LoginForm() {
    const navigate = useNavigate();
    const setAuth = useSetRecoilState(authentication);

    const [showPassword, setShowPassword] = useState(false);

    const LoginSchema = Yup.object().shape({
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required"),
    });

    const defaultValues = {
        username: "",
        password: "",
        remember: true,
    };

    const methods = useForm({
        resolver: yupResolver(LoginSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { mutate: getProfilePicture } = useShowFile({
        onSuccess: (res) => {
            const reader = new FileReader();
            reader.onload = function () {
              const dataURL = reader.result;
              localStorage.setItem("profile_picture", dataURL);
              setAuth({
                  auth: true,
                  user: res.value.data.user,
                  profile_picture: dataURL
              });
              navigate("/dashboard", { replace: true });
            };
            reader.readAsDataURL(res.data);
        },
    });
    const handleLogin = async (formData) => {
        try {
            const res = await http.post("user/auth/login", formData);
            localStorage.setItem("token", res.data.data.access_token);
            if (!!res.data.data.user.photo) {
                getProfilePicture({
                    file: res.data.data.user.photo,
                    ...res.data,
                });
                return;
            }
            setAuth({
                auth: true,
                user: res.data.data.user,
            });
            navigate("/dashboard", { replace: true });
        } catch (err) {
            if (err?.code === "ERR_NETWORK") {
                setError("Network Error");
            }
            if (err?.response?.status === 422) {
                setError("Username or Password is Invalid!");
            }
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("password", data.password);
        setError("");
        setLoading(true);
        handleLogin(formData);
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <Stack direction="row">
                    {error !== "" ? (
                        <Alert
                            sx={{ width: "100%" }}
                            variant="standard"
                            color="error"
                            severity="error"
                        >
                            {error}
                        </Alert>
                    ) : null}
                </Stack>
                <RHFTextField name="username" label="Username" />
                <RHFTextField
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    edge="end"
                                >
                                    <Iconify
                                        icon={
                                            showPassword
                                                ? "eva:eye-fill"
                                                : "eva:eye-off-fill"
                                        }
                                    />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ my: 2 }}
            >
                <Link variant="subtitle2" underline="hover">
                    Forgot password?
                </Link>
            </Stack>

            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={loading}
            >
                Login
            </LoadingButton>
        </FormProvider>
    );
}
