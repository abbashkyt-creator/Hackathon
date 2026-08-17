var E=Object.defineProperty;var o=(e,t)=>E(e,"name",{value:t,configurable:!0});import{w as M,m as S,n as d,u as D,B as I,o as h,E as O,p as x}from"./index-Dm2FPplh.js";const B={name:"texture-bit",vertex:{header:`

        struct TextureUniforms {
            uTextureMatrix:mat3x3<f32>,
        }

        @group(2) @binding(2) var<uniform> textureUniforms : TextureUniforms;
        `,main:`
            uv = (textureUniforms.uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
            @group(2) @binding(0) var uTexture: texture_2d<f32>;
            @group(2) @binding(1) var uSampler: sampler;


        `,main:`
            outColor = textureSample(uTexture, uSampler, vUV);
        `}},N={name:"texture-bit",vertex:{header:`
            uniform mat3 uTextureMatrix;
        `,main:`
            uv = (uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
        uniform sampler2D uTexture;


        `,main:`
            outColor = texture(uTexture, vUV);
        `}};function R(e,t){for(const a in e.attributes){const s=e.attributes[a],f=t[a];f?(s.format??(s.format=f.format),s.offset??(s.offset=f.offset),s.instance??(s.instance=f.instance)):M(`Attribute ${a} is not present in the shader, but is present in the geometry. Unable to infer attribute details.`)}T(e)}o(R,"ensureAttributes");function T(e){const{buffers:t,attributes:a}=e,s={},f={};for(const n in t){const r=t[n];s[r.uid]=0,f[r.uid]=0}for(const n in a){const r=a[n];s[r.buffer.uid]+=S(r.format).stride}for(const n in a){const r=a[n];r.stride??(r.stride=s[r.buffer.uid]),r.start??(r.start=f[r.buffer.uid]),f[r.buffer.uid]+=S(r.format).stride}}o(T,"ensureStartAndStride");const l=[];l[d.NONE]=void 0;l[d.DISABLED]={stencilWriteMask:0,stencilReadMask:0};l[d.RENDERING_MASK_ADD]={stencilFront:{compare:"equal",passOp:"increment-clamp"},stencilBack:{compare:"equal",passOp:"increment-clamp"}};l[d.RENDERING_MASK_REMOVE]={stencilFront:{compare:"equal",passOp:"decrement-clamp"},stencilBack:{compare:"equal",passOp:"decrement-clamp"}};l[d.MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"equal",passOp:"keep"},stencilBack:{compare:"equal",passOp:"keep"}};l[d.INVERSE_MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"not-equal",passOp:"keep"},stencilBack:{compare:"not-equal",passOp:"keep"}};const b=class b{constructor(t){this._syncFunctionHash=Object.create(null),this._adaptor=t,this._systemCheck()}_systemCheck(){if(!D())throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")}ensureUniformGroup(t){const a=this.getUniformGroupData(t);t.buffer||(t.buffer=new I({data:new Float32Array(a.layout.size/4),usage:h.UNIFORM|h.COPY_DST}))}getUniformGroupData(t){return this._syncFunctionHash[t._signature]||this._initUniformGroup(t)}_initUniformGroup(t){const a=t._signature;let s=this._syncFunctionHash[a];if(!s){const f=Object.keys(t.uniformStructures).map(m=>t.uniformStructures[m]),n=this._adaptor.createUboElements(f),r=this._generateUboSync(n.uboElements);s=this._syncFunctionHash[a]={layout:n,syncFunction:r}}return this._syncFunctionHash[a]}_generateUboSync(t){return this._adaptor.generateUboSync(t)}syncUniformGroup(t,a,s){const f=this.getUniformGroupData(t);t.buffer||(t.buffer=new I({data:new Float32Array(f.layout.size/4),usage:h.UNIFORM|h.COPY_DST}));let n=null;return a||(a=t.buffer.data,n=t.buffer.dataInt32),s||(s=0),f.syncFunction(t.uniforms,a,n,s),!0}updateUniformGroup(t){if(t.isStatic&&!t._dirtyId)return!1;t._dirtyId=0;const a=this.syncUniformGroup(t);return t.buffer.update(),a}destroy(){this._syncFunctionHash=null}};o(b,"UboSystem");let F=b;const p=[{type:"mat3x3<f32>",test:o(e=>e.value.a!==void 0,"test"),ubo:`
            var matrix = uv[name].toArray(true);
            data[offset] = matrix[0];
            data[offset + 1] = matrix[1];
            data[offset + 2] = matrix[2];
            data[offset + 4] = matrix[3];
            data[offset + 5] = matrix[4];
            data[offset + 6] = matrix[5];
            data[offset + 8] = matrix[6];
            data[offset + 9] = matrix[7];
            data[offset + 10] = matrix[8];
        `,uniform:`
            gl.uniformMatrix3fv(ud[name].location, false, uv[name].toArray(true));
        `},{type:"vec4<f32>",test:o(e=>e.type==="vec4<f32>"&&e.size===1&&e.value.width!==void 0,"test"),ubo:`
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
            data[offset + 2] = v.width;
            data[offset + 3] = v.height;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height) {
                cv[0] = v.x;
                cv[1] = v.y;
                cv[2] = v.width;
                cv[3] = v.height;
                gl.uniform4f(ud[name].location, v.x, v.y, v.width, v.height);
            }
        `},{type:"vec2<f32>",test:o(e=>e.type==="vec2<f32>"&&e.size===1&&e.value.x!==void 0,"test"),ubo:`
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y) {
                cv[0] = v.x;
                cv[1] = v.y;
                gl.uniform2f(ud[name].location, v.x, v.y);
            }
        `},{type:"vec4<f32>",test:o(e=>e.type==="vec4<f32>"&&e.size===1&&e.value.red!==void 0,"test"),ubo:`
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
            data[offset + 3] = v.alpha;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.alpha) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                cv[3] = v.alpha;
                gl.uniform4f(ud[name].location, v.red, v.green, v.blue, v.alpha);
            }
        `},{type:"vec3<f32>",test:o(e=>e.type==="vec3<f32>"&&e.size===1&&e.value.red!==void 0,"test"),ubo:`
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                gl.uniform3f(ud[name].location, v.red, v.green, v.blue);
            }
        `}];function $(e,t,a,s){const f=[`
        var v = null;
        var v2 = null;
        var t = 0;
        var index = 0;
        var name = null;
        var arrayOffset = null;
    `];let n=0;for(let m=0;m<e.length;m++){const i=e[m],g=i.data.name;let _=!1,u=0;for(let v=0;v<p.length;v++)if(p[v].test(i.data)){u=i.offset/4,f.push(`name = "${g}";`,`offset += ${u-n};`,p[v][t]||p[v].ubo),_=!0;break}if(!_)if(i.data.size>1)u=i.offset/4,f.push(a(i,u-n));else{const v=s[i.data.type];u=i.offset/4,f.push(`
                    v = uv.${g};
                    offset += ${u-n};
                    ${v};
                `)}n=u}const r=f.join(`
`);return new Function("uv","data","dataInt32","offset",r)}o($,"createUboSyncFunction");function c(e,t){return`
        for (let i = 0; i < ${e*t}; i++) {
            data[offset + (((i / ${e})|0) * 4) + (i % ${e})] = v[i];
        }
    `}o(c,"loopMatrix");const A={f32:`
        data[offset] = v;`,i32:`
        dataInt32[offset] = v;`,"vec2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];`,"vec3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];`,"vec4<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];`,"vec2<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];`,"vec3<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];`,"vec4<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];
        dataInt32[offset + 3] = v[3];`,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 4] = v[2];
        data[offset + 5] = v[3];`,"mat3x3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];
        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];`,"mat4x4<f32>":`
        for (let i = 0; i < 16; i++) {
            data[offset + i] = v[i];
        }`,"mat3x2<f32>":c(3,2),"mat4x2<f32>":c(4,2),"mat2x3<f32>":c(2,3),"mat4x3<f32>":c(4,3),"mat2x4<f32>":c(2,4),"mat3x4<f32>":c(3,4)},j={...A,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];
    `},y=class y extends O{constructor({buffer:t,offset:a,size:s}){super(),this.uid=x("buffer"),this._resourceType="bufferResource",this._touched=0,this._resourceId=x("resource"),this._bufferResource=!0,this.destroyed=!1,this.buffer=t,this.offset=a|0,this.size=s,this.buffer.on("change",this.onBufferChange,this)}onBufferChange(){this._resourceId=x("resource"),this.emit("change",this)}destroy(t=!1){this.destroyed=!0,t&&this.buffer.destroy(),this.emit("change",this),this.buffer=null,this.removeAllListeners()}};o(y,"BufferResource");let U=y;export{U as B,l as G,F as U,A as a,p as b,$ as c,N as d,R as e,B as t,j as u};
