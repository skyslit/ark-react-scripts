// @ts-nocheck
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';

const DeveloperMenuModal = (props: any) => {
    const [modal, setModal] = useState(false);
    const { packageRef } = Object.assign({
        packageRef: null
    }, props);
    const updateTheme = (themeId: string) => {
        if (packageRef) {
            packageRef.setTheme(themeId);
        }
    }
    const toggle = () => setModal(!modal);
    
    return (
        <div>
            <Button color="link" style={{ position: 'fixed', top: 0, right: 0 }} onClick={toggle}><i className="fas fa-cogs"></i></Button>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Module Developer Options</ModalHeader>
                <ModalBody>
                    <Form>
                        {
                            packageRef ? (
                                <FormGroup>
                                    <Label for="themeSelector">Select Theme</Label>
                                    <Input type="select" name="themeSelect" disabled={props.global.isThemeChanging} value={props.global.currentThemeId} onChange={(e) => updateTheme(e.target.value)} id="themeSelector">
                                        {
                                            packageRef.themes.map((theme: any, index: number) => <option key={index} value={theme.id}>({`${theme.type}`}) {theme.id}</option>)
                                        }
                                    </Input>
                                    {
                                        props.global.isThemeChanging === true ? (
                                            <small>Theme changing in progress...</small>
                                        ) : null
                                    }
                                </FormGroup>
                            ) : null
                        }
                    </Form>
                </ModalBody>
                <ModalFooter className="position-relative">
                    <div style={{ float: 'left', position: 'absolute', left: '0.75rem', bottom: 'calc(34% - 12px)' }}>
                        <small>Compiled by</small><br /><img src={require('./sk-logo.png')} alt="Skyslit Logo" width={70} />
                    </div>
                    <Button color="primary" onClick={toggle}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default connect((state: any) => ({ global: state['__CORE_PACKAGE'] }))(DeveloperMenuModal);