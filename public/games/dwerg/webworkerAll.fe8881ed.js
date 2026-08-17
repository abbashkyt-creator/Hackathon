function o(o,r,t,e){Object.defineProperty(o,r,{get:t,set:e,enumerable:!0,configurable:!0})}var r=globalThis.parcelRequirea8c3,t=r.register;t("lEmGv",function(o,t){r("iiXtC"),r("fIoxd"),r("e9Bh2"),r("iAbGq"),r("ft8Xn"),r("cc9zz"),r("7caoo"),r("jPARb"),r("hgU2d"),r("5tJIh"),r("7Eqdx"),r("1xk46")}),t("lCwdn",function(r,t){o(r.exports,"color32BitToUniform",()=>e);function e(o,r,t){let e=(o>>24&255)/255;r[t++]=(255&o)/255*e,r[t++]=(o>>8&255)/255*e,r[t++]=(o>>16&255)/255*e,r[t++]=e}}),t("e4dtB",function(r,t){o(r.exports,"BatchableSprite",()=>e);class e{constructor(){this.batcherName="default",this.topology="triangle-list",this.attributeSize=4,this.indexSize=6,this.packAsQuad=!0,this.roundPixels=0,this._attributeStart=0,this._batcher=null,this._batch=null}get blendMode(){return this.renderable.groupBlendMode}get color(){return this.renderable.groupColorAlpha}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.bounds=null}destroy(){}}}),t("jiAbK",function(r,t){o(r.exports,"localUniformBit",()=>e),o(r.exports,"localUniformBitGroup2",()=>i),o(r.exports,"localUniformBitGl",()=>l);let e={name:"local-uniform-bit",vertex:{header:`

            struct LocalUniforms {
                uTransformMatrix:mat3x3<f32>,
                uColor:vec4<f32>,
                uRound:f32,
            }

            @group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `}},i={...e,vertex:{...e.vertex,header:e.vertex.header.replace("group(1)","group(2)")}},l={name:"local-uniform-bit",vertex:{header:`

            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix = uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `}}});