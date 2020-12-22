import React from "react";
import {Button, Modal} from "react-bootstrap";

export class SimpleModal extends React.Component<{text: string, enabled: boolean}, {enabled: boolean}> {

    constructor(props: {text: string, enabled: boolean}) {
        super(props);
        this.state = {
            enabled: props.enabled
        };
    }

    handleClose = () => {
        this.setState({enabled: false});
    }

    render() {
        return (
            <React.Fragment>
                <Modal show={this.state.enabled} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Ошибка</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.props.text}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        );
    }
}
