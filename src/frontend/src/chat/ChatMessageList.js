import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import axios from "axios";
import ChatMessage from "./ChatMessage";
import noprfpic from "../image/noprofilepicture.webp";
import tmp from "../image/tmp.png";
import {ArrowBackRounded} from "@mui/icons-material";
import ChatMessageListOnly from "./chatMessageListOnly";
import noimage from "../image/noimg.jpg";

function ChatMessageList(props) {
    //변수
    const [chatList, setChatList] = useState([]);
    const [uInfo,setUinfo]=useState({});
    const [spInfo,setSpinfo]=useState({});
    const [uTmp,setUTmp]=useState();
    const [tmpCol,setTmpCol]=useState('green');
    const [tmpH, setTmpH]=useState('10px');
    const [tmpY,setTmpY]=useState('5px');
    const [resize, setResize] = useState();
    const [notice,setNotice]=useState();
    const scrollRef=useRef();
    const {cr_num, ur_num,u_num, screenStatef,screenState}=props;
    let imageUrl=sessionStorage.url+"/image/";
    //함수
    //db에서 chat message 출력
    const getChatMessage=()=>{
        let url=sessionStorage.url+"/chat/cm?cr_num="+cr_num;
        axios.get(url).then(res=>{
            setChatList(res.data);
        })
    }
    //입력한 msg 추가
    const addMsg=(msgData)=>{
        setNotice(msgData);
        //console.log(notice);
        setChatList(chatList.concat(msgData));
    }
    //상대방 정보 출력
    const getUInfo=()=>{
        let uinfoUrl=sessionStorage.url+"/chat/u_info?u_num="+u_num;
        axios.get(uinfoUrl).then(res=>{
            setUinfo(res.data);
            setUTmp(res.data.prf_tmp);
        })
    }
    //상대방 온도 출력
    const getTmpCol=()=>{
        if (uInfo.prf_tmp>80)
        {
            setTmpCol('red');
            setTmpH('35px');
            setTmpY('0px')
        }else if(uInfo.prf_tmp>60) {
            setTmpCol('orange');
            setTmpH('27px');
            setTmpY('0px')
        }else if(uInfo.prf_tmp>40) {
            setTmpCol('gold');
            setTmpH('20px');
            setTmpY('2px')
        }else if(uInfo.prf_tmp>20) {
            setTmpCol('green');
            setTmpH('15px');
            setTmpY('5px')
        }else if(uInfo.prf_tmp>10) {
            setTmpCol('dodgerblue');
            setTmpH('10px');
            setTmpY('5px')
        }else {
            setTmpCol('midnightblue');
            setTmpY('0px')
            setTmpH('0px');
        }
    }
    //상품정보 출력
    const getSpInfo=()=>{
        let spinfoUrl=sessionStorage.url+"/chat/spinfo?cr_num="+cr_num;
        axios.get(spinfoUrl).then(res=>{
            setSpinfo(res.data);
        })
    }
    //화면 사이즈 입력
    const handleResize = () => {
        setResize(window.innerWidth);
    };

    //useEffect
    useEffect(()=>{
        getUInfo();
        getSpInfo();
    },[cr_num])
    useEffect(()=>{
        getTmpCol();
    },[uTmp])
    useEffect(()=>{
        getChatMessage();
    },[cr_num,chatList])
    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [screenState]);
    //
    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior:'smooth'});
    },[])
    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior:'smooth'});
    },[cr_num,notice])

    return (
        <div className={'msg_container'}>
            <div className={'msg_list_box'} >
                {/*상대방 정보*/}
                <div className={'msg_list_box_top'}>
                    <span className={'to_chat_room'} onClick={()=>screenStatef(1)}
                    ><ArrowBackRounded/></span>
                    <div className={'uInfoBox'} >
                        <div className={'prf_box'}
                            style={{backgroundImage:`url('${imageUrl+uInfo.prf_img}'),url('${noprfpic}')`}}></div>
                        <div className={'prf_nick'}>{uInfo.prf_nick}님</div>
                        <img alt={''} src={tmp} className={'tmp_img'}/>
                        <div className={'tmp_circle'} style={{backgroundColor:tmpCol}}></div>
                        <div className={'tmp_rec'} style={{backgroundColor:tmpCol, height:tmpH,top:tmpY}}></div>
                        <div className={'prf_tmp'}>{uInfo.prf_tmp}℃</div>
                        <div className={'uinfobox_vline'}>  </div>
                        <div className={'spinfo_img'}
                             style={{backgroundImage:`url('${spInfo.img_name}'),url('${noimage}')`}}/>
                        <div className={'spinfo_title'}>{spInfo.sp_title}</div>
                    </div>
                </div>
                {/* 채팅 메시지 리스트 */}
                <div  className={'msg_list'} >
                    <ChatMessageListOnly chatList={chatList} ur_num={ur_num} uInfo={uInfo} />
                    <div ref={scrollRef} />
                </div>
                {/*채팅 입력 창*/}
                <ChatMessage cr_num={cr_num} addMsg={addMsg} style={{width:'100%'}}/>
            </div>
        </div>
    );
}

export default ChatMessageList;