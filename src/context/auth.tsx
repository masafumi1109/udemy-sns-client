import React, {useContext, useEffect, useState} from 'react';
import apiClient from "@/src/lib/apiClient";

interface AuthContextType {
  user: null | {
    id: number;
    username: string;
    email: string;
  }
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

// アプリケーションのどこからでもこれらのユーザー認証に関連する状態や関数にアクセスできるようになります
const AuthContext = React.createContext<AuthContextType>({
  // 現在のユーザー情報
  user: null,
  login: () => {
  },
  logout: () => {
  },
});

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({children}: AuthProviderProps) => {
  // ユーザーの情報を保持するためのstate。最初はユーザー情報が未設定のため初期値はnull
  // ユーザーがログインしたときにユーザー情報を更新し、ログアウトしたときにnullに戻す
  const [user, setUser] = useState< null | {
    id: number;
    email: string;
    username: string;
  }>(null);

  // 第二引数が空の場合は、コンポーネントがマウントされたとき(画面がリロードされた時)のみ実行される
  useEffect(() => {
    // トークンをローカルストレージから取得
    const token = localStorage.getItem("auth_token");
    if (token) {
      // ヘッダーのオーソリゼーションにトークンをセット
      apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
      // ユーザー情報を取得
      apiClient
        .get("users/find")
        .then((res) => {
        setUser(res.data.user);
      })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  // loginという非同期関数を定義
  const login = async (token: string) => {
    // ブラウザのローカルストレージにauth_tokenというキーでtokenを保存する。
    localStorage.setItem("auth_token", token);
    apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;

    try {
      // ログインした時にユーザー情報を取得する
      apiClient.get("users/find").then((res) => {
        setUser(res.data.user);
        // console.log(res.data.user);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    // ローカルストレージからauth_tokenを削除
    localStorage.removeItem("auth_token");
    // ヘッダーのオーソリゼーションを削除
    delete apiClient.defaults.headers["Authorization"];
    // const userのユーザー情報をnullにする
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
  };

  return (
    // valueはconst AuthProviderで定義したuser, login, logoutの情報を持っている
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
};