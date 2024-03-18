import React, {useEffect, useState} from "react";
import {Post} from "@/src/components/Post";
import apiClient from "@/src/lib/apiClient";
import {PostType} from "@/src/types";

export const Timeline = () => {
  // 入力された内容を保持するためのstate
  const [postText, setPostText] = useState<string>("");
  // 最新の投稿を保持するためのstate
  const [latestPosts, setLatestPosts] = useState<PostType[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // リロードを防ぐ
    e.preventDefault();

    try {
      const newPost = await apiClient.post("/posts/post", {
        // contentがキー、postTextに入力された内容が入っている
        content: postText,
      });
      // 今までの投稿をスプレッド構文にし、新しい投稿に追加
      setLatestPosts((prevPosts) => [newPost.data, ...prevPosts]);
      setPostText("");
      // 投稿が成功したら、入力された内容を空にする
      setPostText("");
    } catch (err) {
      // エラーが発生した場合は、エラーメッセージを表示
      alert("ログインしてください。");
    }
  }
  // 最新の投稿をDBからコンポーネントのレンダリングが終了した後に実行される。
  useEffect(() => {
    const fetchLatestPosts = async () => {
      // /posts/get_latest_postにアクセスが成功したら、最新の投稿を取得
      try {
        const response = await apiClient.get("/posts/get_latest_post");
        setLatestPosts(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLatestPosts();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-4">
        <div className="bg-white shadow-md rounded p-4 mb-4">
          <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-24 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="What's on your mind?"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPostText(e.target.value)}
          value={postText}
        ></textarea>
            <button
              type="submit"
              className="mt-2 bg-gray-700 hover:bg-green-700 duration-200 text-white font-semibold py-2 px-4 rounded"
            >
              投稿
            </button>
          </form>
        </div>
        {latestPosts.map((post: PostType) => (
          <Post key={post.id} post={post}/>
        ))}
      </main>
    </div>
  );
}