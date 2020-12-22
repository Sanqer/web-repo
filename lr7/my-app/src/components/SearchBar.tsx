import React, {useState} from "react";
import {Button, Form} from "react-bootstrap";

interface IProps {
    onFindClick: (text: string) => void
}

export const SearchBar: React.FC<IProps> = (props: IProps) => {
    const [inputText, setInputText] = useState<string>("");

    return (
        <React.Fragment>
            <Form inline>
                    <Form.Control type="text"
                                  placeholder="Введите город для поиска"
                                  onChange={(event) => setInputText(event.target.value)}>
                    </Form.Control>
                    <Button onClick={() => props.onFindClick(inputText)}>Найти</Button>
            </Form>
        </React.Fragment>
    )
}