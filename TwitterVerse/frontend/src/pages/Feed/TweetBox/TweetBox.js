import React, { useState, useEffect } from "react";
import "./TweetBox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import axios from "axios";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../firebase.init"; // Ensure you import your Firebase auth object

function TweetBox() {
    const [post, setPost] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [loggedInUser] = useLoggedInUser();
    const [user, loading, error] = useAuthState(auth); // Pass the auth object here
    const email = user?.email;

    const userProfilePic = loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"

    const handleUploadImage = (e) => {
        setIsLoading(true);
        const image = e.target.files[0];
        const formData = new FormData();
        formData.set('image', image);

        axios.post("https://api.imgbb.com/1/upload?key=ce2e4d1f58f22cdab08d0a12bec54f73", formData)
            .then(res => {
                setImageURL(res.data.data.display_url);
                console.log(res.data.data.display_url);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    }

    const handleTweet = async (e) => {
        e.preventDefault();

        if (!user) {
            console.error("User is not authenticated");
            return;
        }

        try {
            if (user.providerData[0].providerId === 'password') {
                const response = await fetch(`http://localhost:5000/loggedInUser?email=${email}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setName(data[0]?.name);
                setUsername(data[0]?.username);
            } else {
                setName(user?.displayName);
                setUsername(email?.split('@')[0]);
            }

            if (name) {
                const userPost = {
                    profilePhoto: userProfilePic,
                    post: post,
                    photo: imageURL,
                    username: username,
                    name: name,
                    email: email,
                };
                setPost('');
                setImageURL('');

                const postResponse = await fetch('http://localhost:5000/post', {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(userPost),
                });

                if (!postResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const postData = await postResponse.json();
                console.log(postData);
            }
        } catch (error) {
            console.error("Failed to fetch:", error);
        }
    }

    return (
        <div className="tweetBox">
            <form onSubmit={handleTweet}>
                <div className="tweetBox__input">
                    <Avatar src={userProfilePic} />
                    <input
                        type="text"
                        placeholder="What's happening?"
                        onChange={(e) => setPost(e.target.value)}
                        value={post}
                        required
                    />
                </div>

                <div className="imageIcon_tweetButton">
                    <label htmlFor='image' className="imageIcon">
                        {isLoading ? <p>Uploading image</p> : <p>{imageURL ? 'Image uploaded' : <AddPhotoAlternateIcon />}</p>}
                    </label>
                    <input
                        type="file"
                        id='image'
                        className="imageInput"
                        onChange={handleUploadImage}
                    />
                    <Button className="tweetBox__tweetButton" type="submit">Tweet</Button>
                </div>
            </form>
        </div>
    );
}

export default TweetBox;
