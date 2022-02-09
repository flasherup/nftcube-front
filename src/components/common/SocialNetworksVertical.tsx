import React from 'react';
import {Col, Row, Image} from "react-bootstrap";
import './css/SocialNetworks.css'
import DiscordLogo from '../../images/DiscordLogo.svg';
import TwitterLogo from '../../images/TwitterLogo.svg';
import MediumLogo from '../../images/MediumLogo.svg';
import {SOCIAL_NETWORKS_DISCORD, SOCIAL_NETWORKS_MEDIUM, SOCIAL_NETWORKS_TWITTER} from "../../constants";

const CLASS_SOCIAL_NETWORKS_LINK = 'social-networks-link'

function SocialNetworksVertical() {
    return (
        <Row className={'social-networks'}>
            <Col lg={12} xs={4} className={'d-flex justify-content-end'}>
                <Image className={CLASS_SOCIAL_NETWORKS_LINK} onClick={()=>openURL(SOCIAL_NETWORKS_DISCORD)} src={DiscordLogo} />
            </Col>
            <Col lg={12} xs={4} className={'d-flex justify-content-end'}>
                <Image className={CLASS_SOCIAL_NETWORKS_LINK} onClick={()=>openURL(SOCIAL_NETWORKS_TWITTER)} src={TwitterLogo} />
            </Col>
            <Col lg={12} xs={4} className={'d-flex justify-content-end'}>
                <Image className={CLASS_SOCIAL_NETWORKS_LINK} onClick={()=>openURL(SOCIAL_NETWORKS_MEDIUM)} src={MediumLogo} />
            </Col>
        </Row>
    );
}

const openURL = (url: string) => {
    window.open(url);
}

export default SocialNetworksVertical;