import React, { useState, useEffect } from "react";
import Nav from "../components/navbar/Navbar.jsx";

const Community = () => {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const API_BASE_URL = "http://localhost:3001";

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/getPosts`);
            const postsData = await response.json();
            setPosts(postsData);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const addPost = async () => {
        if (!content.trim()) {
            alert("Please write something before posting!");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/addPost`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment: content }),
            });

            if (response.ok) {
                setPosts((prevPosts) => [...prevPosts, { comment: content }]);
                setContent("");
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Failed to add post");
            }
        } catch (error) {
            console.error("Error adding post:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div>
            <Nav></Nav>

        <main className="p-4">
            <section className="bg-white text-black rounded-lg p-6 mx-auto mb-6 shadow-md max-w-xl">
                <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
                <textarea
                    id="postContent"
                    className="w-full h-24 border border-gray-300 rounded-lg p-3 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
                    placeholder="Write something..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button
                    id="postButton"
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition"
                    onClick={addPost}
                >
                    Post
                </button>
            </section>
            <section className="bg-white text-black rounded-lg p-6 mx-auto shadow-md max-w-xl">
                <h2 className="text-xl font-semibold mb-4">Community Posts</h2>
                <div id="postsContainer">
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <div
                                key={index}
                                className="post border-b border-gray-200 pb-3 mb-3 last:border-none"
                            >
                                <div className="user-info flex items-center gap-3 mb-2">
                                    <svg
                                        width="27px"
                                        height="27px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M3.95442 10.166C4.04608 9.76202 3.79293 9.36025 3.38898 9.26859C2.98504 9.17693 2.58327 9.43009 2.49161 9.83403L3.95442 10.166ZM5.49981 4.73283C5.19117 5.00907 5.1649 5.48322 5.44115 5.79187C5.71739 6.10051 6.19154 6.12678 6.50019 5.85053L5.49981 4.73283ZM15 14.25C14.5858 14.25 14.25 14.5858 14.25 15C14.25 15.4142 14.5858 15.75 15 15.75L15 14.25ZM17.25 18.7083C17.25 19.1225 17.5858 19.4583 18 19.4583C18.4142 19.4583 18.75 19.1225 18.75 18.7083H17.25ZM5.25 18.7083C5.25 19.1225 5.58579 19.4583 6 19.4583C6.41421 19.4583 6.75 19.1225 6.75 18.7083H5.25ZM9 15L8.99998 15.75H9V15ZM11 15.75C11.4142 15.75 11.75 15.4142 11.75 15C11.75 14.5858 11.4142 14.25 11 14.25V15.75ZM12 3.75C16.5563 3.75 20.25 7.44365 20.25 12H21.75C21.75 6.61522 17.3848 2.25 12 2.25V3.75ZM12 20.25C7.44365 20.25 3.75 16.5563 3.75 12H2.25C2.25 17.3848 6.61522 21.75 12 21.75V20.25ZM20.25 12C20.25 16.5563 16.5563 20.25 12 20.25V21.75C17.3848 21.75 21.75 17.3848 21.75 12H20.25ZM3.75 12C3.75 11.3688 3.82074 10.7551 3.95442 10.166L2.49161 9.83403C2.33338 10.5313 2.25 11.2564 2.25 12H3.75ZM6.50019 5.85053C7.96026 4.54373 9.88655 3.75 12 3.75V2.25C9.50333 2.25 7.22428 3.1894 5.49981 4.73283L6.50019 5.85053ZM14.25 9C14.25 10.2426 13.2426 11.25 12 11.25V12.75C14.0711 12.75 15.75 11.0711 15.75 9H14.25ZM12 11.25C10.7574 11.25 9.75 10.2426 9.75 9H8.25C8.25 11.0711 9.92893 12.75 12 12.75V11.25ZM9.75 9C9.75 7.75736 10.7574 6.75 12 6.75V5.25C9.92893 5.25 8.25 6.92893 8.25 9H9.75ZM12 6.75C13.2426 6.75 14.25 7.75736 14.25 9H15.75C15.75 6.92893 14.0711 5.25 12 5.25V6.75ZM15 15.75C15.6008 15.75 16.1482 16.0891 16.5769 16.6848C17.0089 17.2852 17.25 18.0598 17.25 18.7083H18.75C18.75 17.7371 18.4052 16.6575 17.7944 15.8086C17.1801 14.9551 16.2275 14.25 15 14.25L15 15.75ZM6.75 18.7083C6.75 18.0598 6.99109 17.2852 7.42315 16.6848C7.85183 16.0891 8.39919 15.75 8.99998 15.75L9.00002 14.25C7.77253 14.25 6.81989 14.9551 6.20564 15.8086C5.59477 16.6575 5.25 17.7371 5.25 18.7083H6.75ZM9 15.75H11V14.25H9V15.75Z"
                                            fill="#000000"
                                        ></path>
                                    </svg>
                                    <span>Unknown</span>
                                </div>
                                <p>{post.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>No posts available</p>
                    )}
                </div>
            </section>
        </main>

        </div>
    );

};


export default Community;
