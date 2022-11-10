import { useRef, useState, useEffect } from 'react';
import * as StompJs from '@stomp/stompjs';
import axios from "axios";

function ChatMessage(props) {
    const [msg, setMsg] = useState('');
    const { cr_num, addMsg } = props;
    const client = useRef({});
    let ur_num=sessionStorage.ur_num;
    const connect = () => {
        client.current = new StompJs.Client({
            brokerURL: 'ws://localhost:9005/ws',
            onConnect: () => {
                console.log('connected');
                let readUrl=localStorage.url+"/chat/read?cr_num="+cr_num+"&ur_num="+ur_num;
                axios.get(readUrl).then(res=>"")
                subscribe();
            },
        });
        client.current.activate();
    };

    const publish = (msg) => {
        if (!client.current.connected) return;

        client.current.publish({
            destination: '/pub/chat',
            body: JSON.stringify({
                sender : ur_num,
                cr_num: cr_num,
                msg:msg,
            }),
        });
        setMsg('');
    };

    const subscribe = () => {
        client.current.subscribe('/sub/chat/' + cr_num, (body) => {
            const json_body = JSON.parse(body.body);
            //console.dir(json_body);
            addMsg(json_body);
        });
    };

    const disconnect = () => {
        client.current.deactivate();
    };

    const handleChange = (event) => { // 채팅 입력 시 state에 값 설정
        setMsg(event.target.value);
    };

    const handleSubmit = (event, msg) => { // 보내기 버튼 눌렀을 때 publish
        event.preventDefault();
        publish(msg);
    };

    useEffect(() => {
        connect();
        return () => disconnect();
    }, []);

    return (
        <div className={'chat-input'}>
            <form onSubmit={(event) => handleSubmit(event, msg)} className={'form-box input-group'}>
                <input type={'text'} name={'chatInput'} className={'message-input form-control'} onChange={handleChange} value={msg} />
                <button type={'submit'} className={'btn-submit'}
                 >보내기 </button>
            </form>
        </div>
    );
}
export default ChatMessage;