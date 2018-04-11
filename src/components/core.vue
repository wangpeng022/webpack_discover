<template>
    <div>
        <div id="msgDialog" :class='{move:this.netErr==1}'>网络连接超时，请稍后重试</div>
        <div id="coolerCore" v-cloak v-show="coreAndMore">
            <div class="loading" v-if='loading' style="text-align: center;">正在加载中···</div>
            <div class="pages">
                <div class="page" v-for="item in systemList" :key="item.systemCode"
                :class="{'offline':item.linkStatus==0,
                        'normal':item.runStatus==1,
                        'bigErr':item.alarmStatus==1}"
                    @click="changePage">
                    <div class="cover" :class="{'close':item.runStatus==0}"></div>
                    <!-- 增加类名 close 关闭状态,蒙板效果 -->
                    <!-- 增加类名 normal 绿色效果 -->
                    <!-- 增加类名 bigErr 红色报警效果 -->
                    <header>
                        <span v-text="item.systemName"></span>
                    </header>
                    <div class="page_content">
                        <div class="online">
                            <span :title="item.linkTime"></span>
                            <span v-text='item.linkStatus==0?"断开":"在线"'></span>
                        </div>
                        <div class="state">
                            <span class='{"bigerr":item.runStatus==2}'></span>
                            <span class='{"bigerr":item.runStatus==2}'>{{item.runStatus|filStatus}}</span>
                        </div>
                        <div class="ee">
                            <span v-text="item.cop?item.cop:'--'"
                            :class="{'blue':item.copStatus==1,
                                    'green':item.copStatus==2,
                                    'yellow':item.copStatus==3,
                                    'red':item.copStatus==4}">--</span>
                            <span>今日能效指标 (EER)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                systemList0: [],//临时数据
                systemList: [],//最终渲染数据
                systemCode: [],//每项Code
                coreAndMore: 1, //切换到详情
                row0: 1,
                row1: 1,
                row2: 1,
                row3: 1,
                row4: 1,
                row5: 1,
                row6: 1,
                netErr: 0,
                loading: 1,
                alarm: [],
                warning: [],
                tipShow: 0,
                analysis: '',
                advise: '',
            }
        },
        filters: {
        filStatus(value) {
            switch (value) {
                case 1:
                    return '正常'
                    break;
                case 0:
                    return '关闭'
                    break;
                case 2:
                    return '故障报警'
                    break;
                case -1:
                    return '未知'
                    break;
                default:
                    break;
            }
        }
    },
    methods: {
        ifNormal(){
            pajax.post({
                url: 'CPHeartBeatService',
                success: (res)=>{
                    if (res[0].serverTime) {
                        this.netErr = 0;
                        this.getData();
                    } else {
                        this.netErr = 1;
                    }
                },
                error:  (err)=>{
                    this.netErr = 1;
                    this.systemList = [];
                },
            })
        },
        getData() {
            pajax.post({
                url: 'CPSystemListService',
                success: (res)=> {
                    this.systemList0 = res[0].dataList;
                    var systemList = this.systemList0;
                    for (let i = 0; i < systemList.length; i++) {
                        var cur = systemList[i].systemCode;
                        this.systemCode.push(cur);
                        pajax.post({
                            url: 'CPSystemStatusService',
                            data:{systemCode: cur},
                            success: (res)=> {
                                // console.log(res);
                                this.$set(this.systemList0[i],"linkStatus",res[0].linkStatus.status);
                                this.$set(this.systemList0[i],"runStatus",res[0].runStatus.status);
                                this.$set(this.systemList0[i],"alarmStatus",res[0].alarmStatus.status);
                                this.$set(this.systemList0[i],"cop",res[0].cop.value);
                                this.$set(this.systemList0[i],"copStatus",res[0].cop.status);
                                this.$set(this.systemList0[i],"linkTime",res[0].linkStatus.lastUpdateTime);
                                setTimeout(() => {
                                    this.loading = 0;
                                    this.systemList = this.systemList0;
                                }, 0);
                                // console.log(this.systemList);
                            },
                            error: function () {},
                        });
                    }
                },
                error: function () {},
            });
        },
        changePage() {
            this.coreAndMore = !this.coreAndMore;
        },
        dropAndDown(index) {
            this[index] = !this[index];

        },
        goToCamera(e) {
            var el = e.currentTarget;
            var aa = el.getAttribute("index");
            alert('当前摄像头' + aa);
        },
        alarmFn (newVal) {
            this.alarm.push(newVal);
            if (this.alarm.length==this.systemList.length) {
                 var tol = this.alarm.reduce((pre, cur) => {
                    return pre+cur;
                }, 0)
                this.row0 = !!(tol);
                this.alarm = [];
            }
        },
        warningFn (newVal) {
            this.warning.push(newVal);
            if (this.warning.length==this.systemList.length) {
                var tol = this.warning.reduce((pre, cur) => {
                    return pre+cur;
                }, 0)
                this.row3 = !!(tol);
                this.warning = [];
            }
        },
        enter(e){
            var l=e.pageX;
            var t=e.pageY;
            this.$refs.tip.style.top = t+5+'px';
            this.$refs.tip.style.left = l+5+'px';
            this.analysis=e.target.getAttribute('analysis');
            this.advise=e.target.getAttribute('advise');
            this.tipShow=1;
        },
        out(e){
            this.tipShow=0;
        },
    },
    beforeMount() {
        // this.ifNormal();
        // clearInterval(this.timer);
        // this.timer = setInterval(() => {
        //     this.ifNormal();
        // }, refreshTime.CPSystemListTime||5000);
    },
    mounted() {
    },
    }
</script>
<style scoped>
    /* 默认样式 */
#cpeco_center{
    overflow: hidden;
    width: 1900px;
    height: 1016px;
    padding: 14px 10px 0 10px;
    background: #F0F3F6;
}
#coolerCore {
    width: 1878px;
    height: 996px;
    border-radius: 6px;
    /* margin-top: 10px; */
    padding: 10px;
    border: 1px solid #D9E2E8;
    font-family: MicrosoftYaHei-Bold;
    color: #333333;
    overflow-x: hidden;
    background: #fff;
}
#coolerCore .pages{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
#coolerCore .page {
    position: relative;
    width: 334px;
    height: 128px;
    padding: 10px;
    margin: 9px;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #D9E2E8;
}
#coolerCore .page:hover{
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.12);
}


/* 每頁標題 */
.page>header span:nth-child(1){
    display: inline-block;
    max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.pages>.page>header {
    width: 320px;
    height: 18px;
    line-height: 18px;
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    font-weight: 900;
    color: #333333;
    margin: 8px 6px 0 10px;
}

.page .page_content {
    display: flex;
    width: 336px;
    height: 65px;
    padding: 10px 0 15px 0;
    margin-top: 14px;
    flex-direction: row;
    justify-content: space-around;
}

.page .page_content div {
    display: flex;
    flex: 1;
    flex-direction: column;
    text-align: center;
}

.page .page_content div span:nth-child(1) {
    flex-grow: 2;
    font-family: 'ArialMT', 'Arial';
    font-weight: 600;
    font-style: normal;
    font-size: 26px;
    color: #a2a2a2;
    justify-content: center;
}
.page .page_content .ee span:nth-child(1){
    padding-top: 7px;
}
.page .page_content .ee span:nth-child(2){
    padding-bottom: 3px;
}
.page .page_content div span:nth-child(2) {
    flex-grow: 1;
    font-family: 'PingFangSC-Regular', 'PingFang SC';
    font-weight: 400;
    font-size: 12px;
    color: #a2a2a2;
}

 .page .cover.close {
    position: absolute;
    top: 0;
    left: 0;
    margin:  50px 10px 10px 10px;
    width: 334px;
    height: 90px;
    background: rgba(171, 171, 171, 0.1);
    z-index: 11;
}

/* 默认样式--灰色 */

.page_content .online span:nth-child(1) {
    height: 30px;
    background: url("../../static/images/online.png") center center no-repeat；
}

.page_content .state span:nth-child(1) {
    height: 30px;
    /* background: url("../images/off.png") center center no-repeat; */
}
.page_content .ee span:nth-child(1){
    height: 30px;
}


/* 网络断开标识 */
.page.offline .online span:nth-child(1) {
    /* background: url("../images/offline.png") center center no-repeat; */
}


/* 正常样式 绿色*/
.page.normal .state span:nth-child(1) {
    /* background: url("../images/normal.png") center center no-repeat; */
}

.page.normal .state span:nth-child(2){
    color: #00CC00;
}


/* 报警样式 */
.page.bigErr .page_content {
    background: rgba(255, 123, 123, 0.1);
}
.page.bigErr{
    border: 1px solid #FF7B7B!important;
}

.page .state span.bigErr:nth-child(1) {
    /* background: url("../images/bigErr.png") center center no-repeat; */
}

.page .state span.bigErr:nth-child(2){
    color: #FF0000;
}
#msgDialog {
    position: absolute;
    top: 10px;
    left: 50%;
    font-size: 16px;
    transform:translate(-50%);
    width: 380px;
    height: 64px;
    line-height: 40px;
    color: #fff;
    background:#F87C7C;
    margin-top: -74px;
    text-align: center;
    box-shadow: 0 1px 4px rgba(0,0,0,0.16);
    transition: all .5s;
}

#msgDialog.move{
    margin-top: 15px;
}
</style>