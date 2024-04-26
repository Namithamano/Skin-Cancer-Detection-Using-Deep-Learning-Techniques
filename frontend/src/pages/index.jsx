import { useCallback, useRef, useState, useEffect } from "react";
import '../home.css';
import { Link } from "react-router-dom";
import { useAuth } from '../context';
import { Navigate } from 'react-router-dom';
import Papa from 'papaparse';
import Skin from '../assets/skin.csv';
import { setDoc, doc, serverTimestamp, arrayUnion, Timestamp } from 'firebase/firestore';
import { db, storage } from "../firebase/firebase";
import { v4 as uuid } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Home = () => {

    const { currentUser } = useAuth()
    const { userLoggedIn } = useAuth()
    const [data, setData] = useState([]);
    const [file, setFile] = useState();
    const [preview, setPreview] = useState();
    const [classtype, setClasstype] = useState();
    const [fullName, setFullName] = useState();
    const [description, setDescription] = useState();
    const [symptoms, setSymptoms] = useState();
    const [treatment, setTreatment] = useState();
    const [imageurl, setImageurl] = useState(null);
    const [percentage, setPercentage] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);

    const papaConfig = {
        complete: (results, file) => {
            const dataWithoutHeader = results.data.slice(1);

            setData(dataWithoutHeader);
            console.log("data")
            console.log(data)
            console.log("data")
        },
        download: true,
        error: (error, file) => {
            console.log('Error while parsing:', error, file);
        },
    };

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    }, [file]);

    useEffect(() => {
        Papa.parse(Skin, papaConfig);
    }, []);


    const uploadFile = () => {
        setIsPredicting(true)
        const img_unique_id = uuid();
        const storageRef = ref(storage, img_unique_id);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                setPercentage(progress);
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageurl(downloadURL);

                    handleUpload(downloadURL);
                });
            }
        );
        setIsPredicting(false)
    };

    const handleUpload = async (downloadURL) => {
        if (file) {
            console.log('calling')
            const imageData = new FormData();
            imageData.append('image', file);
            const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: imageData,
            });
            const data = await response.json();
            setClasstype(data.data['class']);
            setClasstype(data.data['class']);
            setFullName(data.data['fullName']);
            setDescription(data.data['description']);
            setSymptoms(data.data['symptoms']);
            setTreatment(data.data['treatment']);


            const userDocRef = doc(db, "users", currentUser.email);
            await setDoc(userDocRef, {
                uploads: arrayUnion({
                    imageURL: downloadURL,
                    result: data.data['fullName'],
                    timestamp: Timestamp.now(),
                }),
            }, { merge: true });
        }
    };
    const handleReload = () => {
        window.location.reload();
    };
    return (
        <>
            {!userLoggedIn && (<Navigate to={'/login'} replace={true} />)}


            <div class="parent">

                <div class="child">


                    <div class="left">
                        {classtype && <h1>
                            {fullName} ({classtype})
                        </h1>}



                        {!classtype && <>
                            <h3>
                                <strong>SKIN CANCER PREDICTION</strong>
                            </h3>
                            <br />
                            <h4>Please upload your skin image for analysism and I'll identify any sign of skin cancer for you.</h4>
                        </>}
                        <br />

                        {classtype && <h4 className="resulttext">
                            {description}
                        </h4>}                        <br />


                        {classtype && <h4 className="resulttext">
                            Symptoms are: {symptoms}
                        </h4>}
                        <br />

                        <br />
                        <br />

                        {preview && !classtype && <button class="upload" onClick={uploadFile}>
                            Predict
                        </button>
                        }
                        {preview && classtype && <button class="upload" onClick={handleReload}>
                            New Image
                        </button>}
                    </div>
                    <div class="right">
                        <form action="/submit" method="POST" enctype="multipart/form-data">
                            <div class="container">


                                {preview && <img src={preview} alt="Preview" />}

                                {!preview && <label for="fileInput" id="dropArea">
                                    <input type="file" id="fileInput" accept="image/*" hidden name="image" onChange={(e) => {
                                        setFile(e.target.files[0])
                                    }} />
                                    <div id="img-view">
                                        <p>upload your skin image here</p>
                                    </div>

                                </label>
                                }



                            </div>
                        </form>
                    </div>
                </div>
            </div></>
    )
}

export default Home