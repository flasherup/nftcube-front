import React, {ChangeEvent, useCallback, useEffect, useRef} from 'react';
import {Col, Row, Image, Form, Button} from "react-bootstrap";
import ImageUploading, {ImageType} from 'react-images-uploading';
import {ErrorsType, ImageListType} from "react-images-uploading/dist/typings";
import ImagePlaceholder from '../../../../images/ImagePlaceholder.svg';
import ImageError from '../../../../images/ImageError.svg';
import PrevChunk from '../../../../images/PrevChunk.svg'
import NextChunk from '../../../../images/NextChunk.svg'
import './css/EditState.css';
import './../../../common/css/BouncePreloader.css'
import {tokenToCoordinates} from "../../../../utils/token";
import {IpfsResponse, useLazyGetImageQuery} from '../../../../store/backend/IpfsAPI';
import {useAppDispatch} from "../../../../store/Hooks";
import { hideDialog } from '../../../../store/dialogs/DialogsSlice';
import {AssetAttribute} from "../../../../store/NonSerializableStore";


export interface Attribute  extends AssetAttribute{
    token:string
}

interface EditStateProps {
    onSave: (image:string | null, name:string | null, attr:Attribute)=>void
    onError: (error:string)=>void
    chunks: Attribute[]
}

interface Coordinates {
    x:number
    y:number
}

function EditState(props: EditStateProps) {
    const [images, setImages] = React.useState<ImageType[]>([]);
    const [title, setTitle] = React.useState<string>('');
    const [url, setUrl] = React.useState<string>('');
    const [token, setToken] = React.useState<string>('');
    const [coordinates, setCoordinates] = React.useState<Coordinates>({x:0,y:0});
    const [preview, setPreview] = React.useState<string>(ImagePlaceholder);
    const [previewLoadTrigger, previewLoadResult] = useLazyGetImageQuery({})
    const [selectedChunk, setSelectedChunk] = React.useState<Attribute|null>(null);
    const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

    const onChange = useCallback((imageList: ImageListType, addUpdateIndex?: Array<number>) => {
        setImages(imageList);
        setPreview(imageList[0].data_url)
    }, []);

    const onError = useCallback((errors: ErrorsType, files?: ImageListType) => {
        props.onError(errorToString(errors));
    }, [props]);

    /*const updateChunk = useCallback((index:number) => {
        setImages([]);
        setPreview(ImagePlaceholder);
        if (!props || !props.chunks) {
            return;
        }
        const chunk = props.chunks[index];
        if (chunk) {
            setToken(getGetPropsString(chunk.token))
            setTitle(getGetPropsString(chunk.title))
            setUrl(getGetPropsString(chunk.url))
            setSelectedChunk(chunk)
            const [y, x] = tokenToCoordinates(chunk.token);
            setCoordinates({x,y})
            if (chunk.image_uri) {
                previewLoadTrigger({img_hash:chunk.image_uri as string})
            }
        }
    }, [previewLoadTrigger, props]);*/

    const onTitleChange = useCallback((event:ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }, []);

    const onUrlChange = useCallback((event:ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
    }, []);

    const onPrevChunkClick = useCallback(() => {
        const index = (selectedIndex - 1 + props.chunks.length)  % (props.chunks.length);
        setSelectedIndex(index);
    }, [selectedIndex, props]);

    const onNextChunkClick = useCallback(() => {
        const index = (selectedIndex + 1) % (props.chunks.length);
        setSelectedIndex(index);
    }, [selectedIndex, props]);

    useEffect(() => {
        if (selectedChunk) {
            const newToken = getGetPropsString(selectedChunk.token);
            if (token !== newToken) {
                setImages([]);
                setToken(newToken);
                setTitle(getGetPropsString(selectedChunk.title));
                setUrl(getGetPropsString(selectedChunk.url));
            }
            const [y, x] = tokenToCoordinates(selectedChunk.token);
            setCoordinates({x,y})
            if (selectedChunk.image_uri) {
                previewLoadTrigger({img_hash:selectedChunk.image_uri as string})
            }
        } else {
            setPreview(ImagePlaceholder);
        }

    }, [selectedChunk, previewLoadTrigger]);

    useEffect(() => {
        const chunk = props.chunks[selectedIndex];
        if (chunk && chunk !== selectedChunk) {
            setSelectedChunk(chunk);
        }
    },[selectedIndex]);

    useEffect(() => {
        if (selectedIndex >= props.chunks.length) {
            setSelectedIndex(0);
        }
    },[props]);


    useEffect(() => {
        if (previewLoadResult.status === 'fulfilled') {
            const resp = previewLoadResult.data as IpfsResponse
            setPreview(resp.image);
        } else if (previewLoadResult.status === 'rejected') {
            setPreview(ImageError);
        } else {
            setPreview(ImagePlaceholder);
        }

    },[previewLoadResult]);

    const onSaveClick = useCallback(() => {
        let image:string | null = null;
        let name:string | null = null;
        if (images.length > 0) {
            const file = images[0].file;
            name = file ? file.name : '';

            const data = images[0].data_url;
            const s = data.split(',')
            image = s.pop();
        }
        const chunk = selectedChunk;
        if (chunk) {
            chunk.title = title;
            chunk.url = url;
            props.onSave(image, name, chunk);
        }
    }, [images, props, title, url]);


    const dispatch = useAppDispatch();

    const onCancelClick = useCallback(() => {
        dispatch(hideDialog());
    }, [dispatch]);

    const saveDisabled = (images.length === 0 && isChanged(selectedChunk, title, url))

    const maxNumber = 1;
    const maxFileSize = 5000000;

    const imageVisible = previewLoadResult.status === 'pending'?'hidden':'visible';
    const preloaderVisible = previewLoadResult.status === 'pending'?'visible':'hidden';

    const arrowVisibility = props.chunks.length > 1?'visible':'hidden';

    return (
        <Row className={'image-edit-state'}>
            <Col className={'image-edit-state-prev-btn d-none d-md-flex  justify-content-center align-items-center'} style={{visibility:`${arrowVisibility}`}}>
                <Image onClick={onPrevChunkClick} src={PrevChunk} />
            </Col>
            <Col>
                <ImageUploading
                    multiple={false}
                    value={images}
                    onChange={onChange}
                    onError={onError}
                    maxNumber={maxNumber}
                    maxFileSize={maxFileSize}
                    //resolutionType={'ratio'}
                    //resolutionWidth={1}
                    //resolutionHeight={1}
                    dataURLKey="data_url"
                    acceptType={['jpg', 'jpeg', 'png']}
                >
                    {({
                          imageList,
                          onImageUpload,
                          onImageRemoveAll,
                          onImageUpdate,
                          onImageRemove,
                          isDragging,
                          dragProps,
                      }) => (
                        <Form className="upload__image-wrapper">
                            <Row>
                                <Col className={'d-flex justify-content-center align-items-center'}>
                                    <Form.Label>{`#${token} - COORDINATE: ${coordinates.x}, ${coordinates.y}`}</Form.Label>
                                </Col>
                            </Row>
                            <Row>
                                <Form.Group as={Col} md={3} controlId="formGroupImage" className={'d-flex justify-content-center align-items-center'}>
                                    <Row>
                                        <Col className={'image-edit-state-prev-btn d-flex d-md-none  justify-content-center align-items-center'}  style={{visibility:`${arrowVisibility}`}}>
                                            <Image onClick={onPrevChunkClick} src={PrevChunk} />
                                        </Col>
                                        <Col>
                                            <Form.Label>IMAGE</Form.Label>
                                            <Form.Control
                                                className={'image-edit-state-image'}
                                                as={Image}
                                                src={preview}
                                                style={{visibility:`${imageVisible}`}}
                                                onClick={onImageUpload}
                                                {...dragProps}
                                            />
                                            <div className="bounceball" style={{visibility:`${preloaderVisible}`}}/>
                                        </Col>
                                        <Col className={'image-edit-state-next-btn d-flex d-md-none justify-content-center align-items-center'} style={{visibility:`${arrowVisibility}`}}>
                                            <Image  onClick={onNextChunkClick} src={NextChunk} />
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group as={Col} md={9} controlId="formGroupValues">
                                    <Form.Label>TITLE</Form.Label>
                                    <Form.Control onChange={onTitleChange} value={title}/>
                                    <Form.Label>URL</Form.Label>
                                    <Form.Control onChange={onUrlChange} value={url}/>
                                </Form.Group>
                            </Row>
                            <Row className={'image-edit-state-bottom'}>
                                <Col md={5} className={'d-flex justify-content-start align-items-center'}>
                                    <Button
                                        disabled={saveDisabled}
                                        onClick={onSaveClick}
                                        className={'fantom-button'}
                                    >SAVE</Button>
                                    <Button
                                        onClick={onCancelClick}
                                        className={'fantom-button-secondary'}
                                    >CANCEL</Button>
                                </Col>
                                <Col md={7} className={'image-edit-state-links'}>
                                    <Row className={'h-100'}>
                                        <Col  className={'d-flex justify-content-start align-items-end'}>
                                            The image you upload will be resized to a square and the resized square image will be placed on the grid.
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </ImageUploading>
            </Col>
            <Col className={'image-edit-state-next-btn d-none d-md-flex justify-content-center align-items-center'} style={{visibility:`${arrowVisibility}`}}>
                <Image  onClick={onNextChunkClick} src={NextChunk} />
            </Col>
        </Row>
    );
}

const errorToString = (errors:ErrorsType):string => {
    let res = 'Tne image not correspond requirements';
    if (!errors) {
        return res;
    }

    if (errors.resolution) {
        return res += '\nmust be a square image only';
    }

    if (errors.maxFileSize) {
        return res += '\nmust be less than 5mb';
    }

    if (errors.acceptType) {
        return res += '\nmust be of type "jpeg", "jpg" or "png"';
    }

    return res;
}

const getGetPropsString = (value:string | null):string => {
    return value?value:'';
}

const isChanged = (selected:Attribute | null, title:string, url:string):boolean => {
    if (!selected) return true;
    return (!url || selected.url === url) && (!title || selected.title === title);

}

export default EditState;