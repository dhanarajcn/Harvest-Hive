/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import image1 from 'assets/image1.jpg';
import image2 from 'assets/image2.jpg';
import { Fragment } from 'react';

export default function Home() {
    return (
        <Fragment>
            <div css={{
                width: '100%',
                backgroundColor: '#256b6e',
                position: 'relative',
            }}>
                <div css={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(to bottom, #ffffff00, #ffffff33, #ffffff55, #ffffff77,  #ffffff99)',
                    flexDirection: 'column',
                    color: '#112021',
                }}>
                    <div css={{
                        fontSize: '52px',
                    }}>HarvestHive</div>
                    <div css={{
                        fontSize: '24px',
                        textAlign: 'center',
                        padding: '10px 80px 120px 80px',
                        fontStyle: 'italic'
                    }}>"Empowering farmers with equitable commerce."</div>
                </div>
            </div>

            <div css={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 100px',
                gap: '100px'
            }}>
                <div css={{ flex: '3', fontSize: '20px' }}>Welcome to our all-encompassing platform designed to revolutionize the rice industry, offering a comprehensive suite of tools and features to streamline every aspect of the rice trade. Our cutting-edge classification system employs state-of-the-art algorithms to accurately categorize rice varieties based on key attributes such as grain size, color, and milling quality, empowering users to make informed decisions with confidence. Whether you're a small-scale farmer seeking to showcase your harvest or a large-scale distributor searching for specific varieties, our platform provides a user-friendly interface to effortlessly navigate through the diverse landscape of rice products.</div>
                <img src={image1} alt="kyc" css={{
                    width: '350px', height: '500px',
                    flex: '2',
                }} />
            </div>

            <div css={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '50px 50px 50px 150px',
                gap: '70px'
            }}>
                <img src={image2} alt="kyc" css={{
                    width: '200px', height: '300px',
                    flex: '2',
                }} />
                <div css={{ flex: '3', fontSize: '20px' }}>In addition to our robust classification system, our platform facilitates seamless trading and negotiation processes, bridging the gap between buyers and sellers in a transparent and efficient manner. Through integrated communication channels and negotiation tools, users can engage in real-time discussions, negotiate terms, and finalize transactions with ease. Furthermore, our logistics support ensures timely delivery of goods, optimizing supply chain efficiency and minimizing delays. With the added convenience of e-commerce functionality, users can place orders, track shipments, and manage payments securely, all within a single platform. For personalized assistance and support, our call feature connects users with our dedicated team of experts, ready to provide guidance and address any inquiries.</div>
            </div>
        </Fragment>
    )
}