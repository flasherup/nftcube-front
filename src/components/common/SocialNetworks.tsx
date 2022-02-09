import React from 'react';
import {Col, Row, Image} from "react-bootstrap";
import './css/SocialNetworks.css'
import DiscordLogo from '../../images/DiscordLogo.svg';
import TwitterLogo from '../../images/TwitterLogo.svg';
import MediumLogo from '../../images/MediumLogo.svg';
import {SOCIAL_NETWORKS_DISCORD, SOCIAL_NETWORKS_MEDIUM, SOCIAL_NETWORKS_TWITTER} from "../../constants";

const CLASS_SOCIAL_NETWORKS_LINK = 'social-networks-link'

function SocialNetworks() {
    return (
        <Row>
            <Col className={'d-flex justify-content-start align-items-center'}>
                <Image className={CLASS_SOCIAL_NETWORKS_LINK} onClick={()=>openURL(SOCIAL_NETWORKS_DISCORD)} src={DiscordLogo} />
                <Image className={CLASS_SOCIAL_NETWORKS_LINK} onClick={()=>openURL(SOCIAL_NETWORKS_TWITTER)} src={TwitterLogo} />
                <Image className={CLASS_SOCIAL_NETWORKS_LINK} onClick={()=>openURL(SOCIAL_NETWORKS_MEDIUM)} src={MediumLogo} />
            </Col>
        </Row>
    );
}

const openURL = (url: string) => {
    window.open(url);
}

export default SocialNetworks;