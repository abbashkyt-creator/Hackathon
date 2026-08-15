$(document).ready(function(){
                     var oMain = new CMain({
                         
                                            show_score: true,
                                            start_score: 5000,
                                            score_decrease_per_second: 10,
                                           });
                                           
                                           
                     $(oMain).on("start_session", function(evt) {
                            if(getParamValue('ctl-arcade') === "true"){
                                parent.__ctlArcadeStartSession();
                            }
                            //...ADD YOUR CODE HERE EVENTUALLY
                    });
                     
                    $(oMain).on("end_session", function(evt) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeEndSession();
                           }
                           //...ADD YOUR CODE HERE EVENTUALLY
                    });
                    
                    $(oMain).on("save_score", function(evt,iWinner, iBlackTime, iWhiteTime, s_iGameType, iWhiteScore) {
							// iWinner: 
							// -1 IS DRAW
							//0 WHITE WINS
							//1 BLACK WINS
							
                            if(getParamValue('ctl-arcade') === "true" && s_iGameType === 1 && iWinner === 0){
                               parent.__ctlArcadeSaveScore({score:iWhiteScore, szMode: s_iGameType+""});
                           }
                     });
                     
                     $(oMain).on("share_event", function(evt, iScore, s_iGameType, iWinner) {
                           if(getParamValue('ctl-arcade') === "true" && s_iGameType === 1 && iWinner === 0){
                               parent.__ctlArcadeShareEvent({   img: TEXT_SHARE_IMAGE,
                                                                title: TEXT_SHARE_TITLE,
                                                                msg: TEXT_SHARE_MSG1 + iScore + TEXT_SHARE_MSG2,
                                                                msg_share: TEXT_SHARE_SHARE1 + iScore + TEXT_SHARE_SHARE1});
                           }
                           //...ADD YOUR CODE HERE EVENTUALLY
                    });


                    $(oMain).on("show_interlevel_ad", function(evt) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeShowInterlevelAD();
                           }
                           //...ADD YOUR CODE HERE EVENTUALLY
                    });
                     
                    if(isIOS()){ 
                        setTimeout(function(){sizeHandler();},200); 
                    }else{
                        sizeHandler(); 
                    }
           });