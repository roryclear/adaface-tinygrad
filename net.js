
const ADAFACE = (() => {
const getTensorBuffer = (safetensorBuffer, tensorMetadata) => {
  return safetensorBuffer.subarray(...tensorMetadata.data_offsets);
};

const getTensorMetadata = (safetensorBuffer) => {
    const metadataLength = Number(new DataView(safetensorBuffer.buffer).getBigUint64(0, true));
    const metadata = JSON.parse(new TextDecoder("utf8").decode(safetensorBuffer.subarray(8, 8 + metadataLength)));
    return Object.fromEntries(Object.entries(metadata).filter(([k, v]) => k !== "__metadata__").map(([k, v]) => [k, {...v, data_offsets: v.data_offsets.map(x => 8 + metadataLength + x)}]));
};

const createEmptyBuf = (device, size) => {
    return device.createBuffer({size, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST });
};

const createUniformBuf = (device, size) => {
  return device.createBuffer({size, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST})
}

const createInfinityUniformBuf = (device) => {
  const size = 4;
  const buf = device.createBuffer({
    mappedAtCreation: true,
    size,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
  });
  new Float32Array(buf.getMappedRange())[0] = Infinity;
  buf.unmap();
  return buf;
};

const createWeightBuf = (device, size, data) => {
  const buf = device.createBuffer({ size, usage: GPUBufferUsage.STORAGE, mappedAtCreation: true });
  new Uint8Array(buf.getMappedRange()).set(data); buf.unmap();
  return buf;
};

const addComputePass = (device, commandEncoder, pipeline, layout, infinityUniformBuf, bufs, workgroup) => {
  const bindGroup = device.createBindGroup({
    layout: layout,
    entries: [
      { binding: 0, resource: { buffer: infinityUniformBuf } },
      ...bufs.map((buffer, index) => ({ binding: index + 1, resource: { buffer } }))
    ]
  });

  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);
  passEncoder.dispatchWorkgroups(...workgroup);
  passEncoder.end();
};

const r_2_56_112_32_2_3_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_802816:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_37632:array<atomic<u32>>;
@group(0) @binding(3)var<storage,read_write>data2_1728:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_64:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_64:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_64:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_64:array<f32>;
@group(0) @binding(8)var<storage,read_write>data7_64:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,2>;
  var gidx0 = i32(gindex.x); /* 112 */
  var gidx1 = i32(gindex.y); /* 56 */
  var gidx2 = i32(gindex.z); /* 2 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx1<55);
  var alu1 = (0<gidx1);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 3; Ridx0++) {
    for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
      var alu4 = (gidx0+Ridx2);
      var alu5 = ((((gidx0*3)+(Ridx2*3))-Ridx0)+(gidx1*672));
      var alu6 = (alu5+-337);
      var alu7 = select(0,3,(alu6<0));
      var alu8 = ((0<alu4)&(alu4<113));
      var val0 = select(0u, atomicLoad(&data1_37632[((alu6+alu7)>>2u)]), (alu8&alu1));
      var alu9 = (alu5+-1);
      var alu10 = select(0,3,(alu9<0));
      var val1 = select(0u, atomicLoad(&data1_37632[((alu9+alu10)>>2u)]), alu8);
      var alu11 = (alu5+335);
      var val2 = select(0u, atomicLoad(&data1_37632[(alu11>>2u)]), alu8);
      var alu12 = (alu5+671);
      var val3 = select(0u, atomicLoad(&data1_37632[(alu12>>2u)]), (alu8&alu0));
      var alu13 = ((gidx2*864)+(lidx0*27)+(Ridx0*9)+Ridx2);
      var val4 = data2_1728[(alu13+3)];
      var val5 = data2_1728[(alu13+6)];
      var val6 = data2_1728[alu13];
      var alu14 = select(0.0f,((((f32((u32(((val0>>(((u32(alu6))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),(alu1&alu8));
      var alu15 = select(0.0f,((((f32((u32(((val1>>(((u32(alu9))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),alu8);
      var alu16 = select(0.0f,((((f32((u32(((val2>>(((u32(alu11))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),alu8);
      var alu17 = select(0.0f,((((f32((u32(((val3>>(((u32(alu12))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),(alu0&alu8));
      acc0[0] = (acc0[0]+(alu14*val6)+(alu15*val4)+(alu16*val5));
      acc0[1] = (acc0[1]+(alu15*val6)+(alu16*val4)+(alu17*val5));
    }
  }
  var alu22 = (lidx0+bitcast<i32>((bitcast<u32>(gidx2)<<5u)));
  var val7 = data3_64[alu22];
  var val8 = data4_64[alu22];
  var val9 = data5_64[alu22];
  var val10 = data6_64[alu22];
  var val11 = data7_64[alu22];
  var alu23 = (gidx0+(gidx1*224)+(gidx2*401408)+(lidx0*12544));
  var alu24 = (1/sqrt((val9+1e-05f)));
  var alu25 = (((acc0[0]-val7)*val8*alu24)+val10);
  var alu26 = (((acc0[1]-val7)*val8*alu24)+val10);
  var alu27 = select((val11*alu25),alu25,(0.0f<alu25));
  var alu28 = select((val11*alu26),alu26,(0.0f<alu26));
  data0_802816[alu23] = alu27;
  data0_802816[(alu23+112)] = alu28;
}`;

const E_256_2 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_512:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_512:array<f32>;
@compute @workgroup_size(1) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 256 */
  var cast0 = bitcast<i32>((bitcast<u32>(gidx0)<<1u));
  var val0 = data1_512[cast0];
  var alu0 = (cast0+1);
  var val1 = data1_512[alu0];
  data0_512[cast0] = -val0;
  data0_512[alu0] = -val1;
}`;

const E_64_49_16_16 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_802816:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_802816:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_64:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_64:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_64:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_64:array<f32>;
@compute @workgroup_size(16,16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 49 */
  var gidx1 = i32(gindex.y); /* 64 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 16 */
  var alu0 = (lidx0+bitcast<i32>((bitcast<u32>(gidx0)<<8u))+bitcast<i32>((bitcast<u32>(lidx1)<<4u))+(gidx1*12544));
  var val0 = data1_802816[alu0];
  var val1 = data2_64[gidx1];
  var val2 = data3_64[gidx1];
  var val3 = data4_64[gidx1];
  var val4 = data5_64[gidx1];
  data0_802816[alu0] = (((val0-val1)*val2*(1/sqrt((val3+1e-05f))))+val4);
}`;

const r_2_112_16_32_7_16_3_3_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_802816:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_802816:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_36864:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_64:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_64:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_64:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_64:array<f32>;
@group(0) @binding(8)var<storage,read_write>data7_64:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,7>;
  var gidx0 = i32(gindex.x); /* 16 */
  var gidx1 = i32(gindex.y); /* 112 */
  var gidx2 = i32(gindex.z); /* 2 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx0*7);
  var alu1 = (gidx1*112);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 16; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu9 = (gidx1+Ridx1);
      var alu10 = ((0<alu9)&(alu9<113));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu11 = (alu0+Ridx2);
        var alu12 = (alu11+alu1+(Ridx1*112)+(Ridx0*50176));
        var alu13 = ((0<(gidx0+Ridx2))&alu10);
        var val0 = select(0.0f, data1_802816[(alu12+-113)], alu13);
        var alu14 = ((Ridx1*3)+Ridx2+(Ridx0*36)+(gidx2*18432)+(lidx0*576));
        var val1 = data2_36864[alu14];
        var val2 = select(0.0f, data1_802816[(alu12+12431)], alu13);
        var val3 = data2_36864[(alu14+9)];
        var val4 = select(0.0f, data1_802816[(alu12+24975)], alu13);
        var val5 = data2_36864[(alu14+18)];
        var val6 = select(0.0f, data1_802816[(alu12+-110)], alu10);
        var val7 = select(0.0f, data1_802816[(alu12+12433)], alu10);
        var val8 = select(0.0f, data1_802816[(alu12+12434)], alu10);
        var val9 = select(0.0f, data1_802816[(alu12+24977)], alu10);
        var val10 = select(0.0f, data1_802816[(alu12+37519)], alu13);
        var val11 = data2_36864[(alu14+27)];
        var val12 = select(0.0f, data1_802816[(alu12+-112)], alu10);
        var val13 = select(0.0f, data1_802816[(alu12+-111)], alu10);
        var val14 = select(0.0f, data1_802816[(alu12+12432)], alu10);
        var val15 = select(0.0f, data1_802816[(alu12+24976)], alu10);
        var val16 = select(0.0f, data1_802816[(alu12+37520)], alu10);
        var val17 = select(0.0f, data1_802816[(alu12+37521)], alu10);
        var val18 = select(0.0f, data1_802816[(alu12+24978)], alu10);
        var val19 = select(0.0f, data1_802816[(alu12+37522)], alu10);
        var val20 = select(0.0f, data1_802816[(alu12+-109)], alu10);
        var val21 = select(0.0f, data1_802816[(alu12+-108)], alu10);
        var val22 = select(0.0f, data1_802816[(alu12+12435)], alu10);
        var val23 = select(0.0f, data1_802816[(alu12+12436)], alu10);
        var val24 = select(0.0f, data1_802816[(alu12+24979)], alu10);
        var val25 = select(0.0f, data1_802816[(alu12+37523)], alu10);
        var alu15 = ((alu11<107)&alu10);
        var val26 = select(0.0f, data1_802816[(alu12+-107)], alu15);
        var val27 = select(0.0f, data1_802816[(alu12+12437)], alu15);
        var val28 = select(0.0f, data1_802816[(alu12+24980)], alu10);
        var val29 = select(0.0f, data1_802816[(alu12+24981)], alu15);
        var val30 = select(0.0f, data1_802816[(alu12+37524)], alu10);
        var val31 = select(0.0f, data1_802816[(alu12+37525)], alu15);
        acc0[0] = (acc0[0]+(val0*val1)+(val2*val3)+(val4*val5)+(val10*val11));
        acc0[1] = (acc0[1]+(val12*val1)+(val14*val3)+(val15*val5)+(val16*val11));
        acc0[2] = (acc0[2]+(val13*val1)+(val7*val3)+(val9*val5)+(val17*val11));
        acc0[3] = (acc0[3]+(val6*val1)+(val8*val3)+(val18*val5)+(val19*val11));
        acc0[4] = (acc0[4]+(val20*val1)+(val22*val3)+(val24*val5)+(val25*val11));
        acc0[5] = (acc0[5]+(val21*val1)+(val23*val3)+(val28*val5)+(val30*val11));
        acc0[6] = (acc0[6]+(val26*val1)+(val27*val3)+(val29*val5)+(val31*val11));
      }
    }
  }
  var alu26 = (lidx0+bitcast<i32>((bitcast<u32>(gidx2)<<5u)));
  var val32 = data3_64[alu26];
  var val33 = data4_64[alu26];
  var val34 = data5_64[alu26];
  var val35 = data6_64[alu26];
  var val36 = data7_64[alu26];
  var alu27 = (alu0+alu1+(gidx2*401408)+(lidx0*12544));
  var alu28 = (1/sqrt((val34+1e-05f)));
  var alu29 = (((acc0[0]-val32)*val33*alu28)+val35);
  var alu30 = (((acc0[1]-val32)*val33*alu28)+val35);
  var alu31 = (((acc0[2]-val32)*val33*alu28)+val35);
  var alu32 = (((acc0[3]-val32)*val33*alu28)+val35);
  var alu33 = (((acc0[4]-val32)*val33*alu28)+val35);
  var alu34 = (((acc0[5]-val32)*val33*alu28)+val35);
  var alu35 = (((acc0[6]-val32)*val33*alu28)+val35);
  var alu36 = select((val36*alu29),alu29,(0.0f<alu29));
  var alu37 = select((val36*alu30),alu30,(0.0f<alu30));
  var alu38 = select((val36*alu31),alu31,(0.0f<alu31));
  var alu39 = select((val36*alu32),alu32,(0.0f<alu32));
  var alu40 = select((val36*alu33),alu33,(0.0f<alu33));
  var alu41 = select((val36*alu34),alu34,(0.0f<alu34));
  var alu42 = select((val36*alu35),alu35,(0.0f<alu35));
  data0_802816[(alu27+1)] = alu37;
  data0_802816[(alu27+2)] = alu38;
  data0_802816[(alu27+3)] = alu39;
  data0_802816[(alu27+4)] = alu40;
  data0_802816[(alu27+5)] = alu41;
  data0_802816[(alu27+6)] = alu42;
  data0_802816[alu27] = alu36;
}`;

const r_8_14_32_7_4_2_64_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_200704:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_802816:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_36864:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_64:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_64:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_64:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_64:array<f32>;
@group(0) @binding(8)var<storage,read_write>data7_802816:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,56>;
  var gidx0 = i32(gindex.x); /* 14 */
  var gidx1 = i32(gindex.y); /* 8 */
  var lidx0 = i32(lindex.x); /* 32 */
  var cast0 = bitcast<u32>(gidx0);
  var cast1 = bitcast<i32>((cast0<<3u));
  var alu0 = (gidx1*1568);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  acc0[7] = 0.0f;
  acc0[8] = 0.0f;
  acc0[9] = 0.0f;
  acc0[10] = 0.0f;
  acc0[11] = 0.0f;
  acc0[12] = 0.0f;
  acc0[13] = 0.0f;
  acc0[14] = 0.0f;
  acc0[15] = 0.0f;
  acc0[16] = 0.0f;
  acc0[17] = 0.0f;
  acc0[18] = 0.0f;
  acc0[19] = 0.0f;
  acc0[20] = 0.0f;
  acc0[21] = 0.0f;
  acc0[22] = 0.0f;
  acc0[23] = 0.0f;
  acc0[24] = 0.0f;
  acc0[25] = 0.0f;
  acc0[26] = 0.0f;
  acc0[27] = 0.0f;
  acc0[28] = 0.0f;
  acc0[29] = 0.0f;
  acc0[30] = 0.0f;
  acc0[31] = 0.0f;
  acc0[32] = 0.0f;
  acc0[33] = 0.0f;
  acc0[34] = 0.0f;
  acc0[35] = 0.0f;
  acc0[36] = 0.0f;
  acc0[37] = 0.0f;
  acc0[38] = 0.0f;
  acc0[39] = 0.0f;
  acc0[40] = 0.0f;
  acc0[41] = 0.0f;
  acc0[42] = 0.0f;
  acc0[43] = 0.0f;
  acc0[44] = 0.0f;
  acc0[45] = 0.0f;
  acc0[46] = 0.0f;
  acc0[47] = 0.0f;
  acc0[48] = 0.0f;
  acc0[49] = 0.0f;
  acc0[50] = 0.0f;
  acc0[51] = 0.0f;
  acc0[52] = 0.0f;
  acc0[53] = 0.0f;
  acc0[54] = 0.0f;
  acc0[55] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 64; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu57 = ((gidx1*14)+Ridx1+(Ridx0*112)+-1);
      var alu58 = select(0,1,(alu57<0));
      var alu59 = (0<(gidx1+Ridx1));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu60 = (cast1+Ridx2);
        var alu61 = (alu60+alu0+(Ridx1*112)+(Ridx0*12544));
        var val0 = data1_802816[(alu61+337)];
        var alu62 = (alu61+-113);
        var alu63 = select(0,255,(alu62<0));
        var alu64 = (0<(gidx0+Ridx2));
        var val1 = select(0.0f, data1_802816[(alu60+((alu57-(112*(((alu57*9363)>>20u)+alu58)))*112)+(((((alu62+alu63)>>8u)*2675)>>17u)*12544)+-1)], (alu64&alu59));
        var alu65 = ((Ridx1*3)+Ridx2+(Ridx0*9)+(lidx0*576));
        var val2 = data2_36864[alu65];
        var val3 = data2_36864[(alu65+18432)];
        var val4 = select(0.0f, data1_802816[(alu61+-111)], alu59);
        var val5 = select(0.0f, data1_802816[(alu61+-109)], alu59);
        var val6 = select(0.0f, data1_802816[(alu61+-107)], alu59);
        var val7 = select(0.0f, data1_802816[(alu61+111)], alu64);
        var val8 = data1_802816[(alu61+113)];
        var val9 = data1_802816[(alu61+115)];
        var val10 = data1_802816[(alu61+117)];
        var val11 = select(0.0f, data1_802816[(alu61+335)], alu64);
        var val12 = data1_802816[(alu61+339)];
        var val13 = data1_802816[(alu61+341)];
        var val14 = select(0.0f, data1_802816[(alu61+559)], alu64);
        var val15 = data1_802816[(alu61+561)];
        var val16 = data1_802816[(alu61+563)];
        var val17 = data1_802816[(alu61+565)];
        var val18 = select(0.0f, data1_802816[(alu61+783)], alu64);
        var val19 = data1_802816[(alu61+785)];
        var val20 = data1_802816[(alu61+787)];
        var val21 = data1_802816[(alu61+789)];
        var val22 = select(0.0f, data1_802816[(alu61+1007)], alu64);
        var val23 = data1_802816[(alu61+1009)];
        var val24 = data1_802816[(alu61+1011)];
        var val25 = data1_802816[(alu61+1013)];
        var val26 = select(0.0f, data1_802816[(alu61+1231)], alu64);
        var val27 = data1_802816[(alu61+1233)];
        var val28 = data1_802816[(alu61+1235)];
        var val29 = data1_802816[(alu61+1237)];
        acc0[0] = (acc0[0]+(val1*val2));
        acc0[1] = (acc0[1]+(val1*val3));
        acc0[2] = (acc0[2]+(val4*val2));
        acc0[3] = (acc0[3]+(val4*val3));
        acc0[4] = (acc0[4]+(val5*val2));
        acc0[5] = (acc0[5]+(val5*val3));
        acc0[6] = (acc0[6]+(val6*val2));
        acc0[7] = (acc0[7]+(val6*val3));
        acc0[8] = (acc0[8]+(val7*val2));
        acc0[9] = (acc0[9]+(val7*val3));
        acc0[10] = (acc0[10]+(val8*val2));
        acc0[11] = (acc0[11]+(val8*val3));
        acc0[12] = (acc0[12]+(val9*val2));
        acc0[13] = (acc0[13]+(val9*val3));
        acc0[14] = (acc0[14]+(val10*val2));
        acc0[15] = (acc0[15]+(val10*val3));
        acc0[16] = (acc0[16]+(val11*val2));
        acc0[17] = (acc0[17]+(val11*val3));
        acc0[18] = (acc0[18]+(val0*val2));
        acc0[19] = (acc0[19]+(val0*val3));
        acc0[20] = (acc0[20]+(val12*val2));
        acc0[21] = (acc0[21]+(val12*val3));
        acc0[22] = (acc0[22]+(val13*val2));
        acc0[23] = (acc0[23]+(val13*val3));
        acc0[24] = (acc0[24]+(val14*val2));
        acc0[25] = (acc0[25]+(val14*val3));
        acc0[26] = (acc0[26]+(val15*val2));
        acc0[27] = (acc0[27]+(val15*val3));
        acc0[28] = (acc0[28]+(val16*val2));
        acc0[29] = (acc0[29]+(val16*val3));
        acc0[30] = (acc0[30]+(val17*val2));
        acc0[31] = (acc0[31]+(val17*val3));
        acc0[32] = (acc0[32]+(val18*val2));
        acc0[33] = (acc0[33]+(val18*val3));
        acc0[34] = (acc0[34]+(val19*val2));
        acc0[35] = (acc0[35]+(val19*val3));
        acc0[36] = (acc0[36]+(val20*val2));
        acc0[37] = (acc0[37]+(val20*val3));
        acc0[38] = (acc0[38]+(val21*val2));
        acc0[39] = (acc0[39]+(val21*val3));
        acc0[40] = (acc0[40]+(val22*val2));
        acc0[41] = (acc0[41]+(val22*val3));
        acc0[42] = (acc0[42]+(val23*val2));
        acc0[43] = (acc0[43]+(val23*val3));
        acc0[44] = (acc0[44]+(val24*val2));
        acc0[45] = (acc0[45]+(val24*val3));
        acc0[46] = (acc0[46]+(val25*val2));
        acc0[47] = (acc0[47]+(val25*val3));
        acc0[48] = (acc0[48]+(val26*val2));
        acc0[49] = (acc0[49]+(val26*val3));
        acc0[50] = (acc0[50]+(val27*val2));
        acc0[51] = (acc0[51]+(val27*val3));
        acc0[52] = (acc0[52]+(val28*val2));
        acc0[53] = (acc0[53]+(val28*val3));
        acc0[54] = (acc0[54]+(val29*val2));
        acc0[55] = (acc0[55]+(val29*val3));
      }
    }
  }
  var val30 = data3_64[lidx0];
  var val31 = data4_64[lidx0];
  var val32 = data5_64[lidx0];
  var val33 = data6_64[lidx0];
  var alu125 = (cast1+alu0+(lidx0*12544));
  var val34 = data7_802816[alu125];
  var val35 = data7_802816[(alu125+2)];
  var val36 = data7_802816[(alu125+4)];
  var val37 = data7_802816[(alu125+6)];
  var val38 = data7_802816[(alu125+224)];
  var val39 = data7_802816[(alu125+226)];
  var val40 = data7_802816[(alu125+228)];
  var val41 = data7_802816[(alu125+230)];
  var val42 = data7_802816[(alu125+448)];
  var val43 = data7_802816[(alu125+450)];
  var val44 = data7_802816[(alu125+452)];
  var val45 = data7_802816[(alu125+454)];
  var val46 = data7_802816[(alu125+672)];
  var val47 = data7_802816[(alu125+674)];
  var val48 = data7_802816[(alu125+676)];
  var val49 = data7_802816[(alu125+678)];
  var val50 = data7_802816[(alu125+896)];
  var val51 = data7_802816[(alu125+898)];
  var val52 = data7_802816[(alu125+900)];
  var val53 = data7_802816[(alu125+902)];
  var val54 = data7_802816[(alu125+1348)];
  var val55 = data7_802816[(alu125+1350)];
  var alu126 = (lidx0+32);
  var val56 = data3_64[alu126];
  var val57 = data4_64[alu126];
  var val58 = data5_64[alu126];
  var val59 = data6_64[alu126];
  var val60 = data7_802816[(alu125+401408)];
  var val61 = data7_802816[(alu125+401410)];
  var val62 = data7_802816[(alu125+401412)];
  var val63 = data7_802816[(alu125+1120)];
  var val64 = data7_802816[(alu125+1122)];
  var val65 = data7_802816[(alu125+1124)];
  var val66 = data7_802816[(alu125+1126)];
  var val67 = data7_802816[(alu125+1344)];
  var val68 = data7_802816[(alu125+1346)];
  var val69 = data7_802816[(alu125+401414)];
  var val70 = data7_802816[(alu125+401632)];
  var val71 = data7_802816[(alu125+401634)];
  var val72 = data7_802816[(alu125+401636)];
  var val73 = data7_802816[(alu125+401638)];
  var val74 = data7_802816[(alu125+401856)];
  var val75 = data7_802816[(alu125+401858)];
  var val76 = data7_802816[(alu125+401860)];
  var val77 = data7_802816[(alu125+401862)];
  var val78 = data7_802816[(alu125+402080)];
  var val79 = data7_802816[(alu125+402082)];
  var val80 = data7_802816[(alu125+402084)];
  var val81 = data7_802816[(alu125+402086)];
  var val82 = data7_802816[(alu125+402304)];
  var val83 = data7_802816[(alu125+402306)];
  var val84 = data7_802816[(alu125+402308)];
  var val85 = data7_802816[(alu125+402310)];
  var val86 = data7_802816[(alu125+402528)];
  var val87 = data7_802816[(alu125+402530)];
  var val88 = data7_802816[(alu125+402532)];
  var val89 = data7_802816[(alu125+402534)];
  var val90 = data7_802816[(alu125+402752)];
  var val91 = data7_802816[(alu125+402754)];
  var val92 = data7_802816[(alu125+402756)];
  var val93 = data7_802816[(alu125+402758)];
  var alu127 = (bitcast<i32>((cast0<<2u))+(gidx1*392)+(lidx0*3136));
  var alu128 = (1/sqrt((val32+1e-05f)));
  data0_200704[alu127] = (((acc0[0]-val30)*val31*alu128)+val33+val34);
  data0_200704[(alu127+1)] = (((acc0[2]-val30)*val31*alu128)+val33+val35);
  data0_200704[(alu127+2)] = (((acc0[4]-val30)*val31*alu128)+val33+val36);
  data0_200704[(alu127+3)] = (((acc0[6]-val30)*val31*alu128)+val33+val37);
  data0_200704[(alu127+56)] = (((acc0[8]-val30)*val31*alu128)+val33+val38);
  data0_200704[(alu127+57)] = (((acc0[10]-val30)*val31*alu128)+val33+val39);
  data0_200704[(alu127+58)] = (((acc0[12]-val30)*val31*alu128)+val33+val40);
  data0_200704[(alu127+59)] = (((acc0[14]-val30)*val31*alu128)+val33+val41);
  data0_200704[(alu127+112)] = (((acc0[16]-val30)*val31*alu128)+val33+val42);
  data0_200704[(alu127+113)] = (((acc0[18]-val30)*val31*alu128)+val33+val43);
  data0_200704[(alu127+114)] = (((acc0[20]-val30)*val31*alu128)+val33+val44);
  data0_200704[(alu127+115)] = (((acc0[22]-val30)*val31*alu128)+val33+val45);
  data0_200704[(alu127+168)] = (((acc0[24]-val30)*val31*alu128)+val33+val46);
  data0_200704[(alu127+169)] = (((acc0[26]-val30)*val31*alu128)+val33+val47);
  data0_200704[(alu127+170)] = (((acc0[28]-val30)*val31*alu128)+val33+val48);
  data0_200704[(alu127+171)] = (((acc0[30]-val30)*val31*alu128)+val33+val49);
  data0_200704[(alu127+224)] = (((acc0[32]-val30)*val31*alu128)+val33+val50);
  data0_200704[(alu127+225)] = (((acc0[34]-val30)*val31*alu128)+val33+val51);
  data0_200704[(alu127+226)] = (((acc0[36]-val30)*val31*alu128)+val33+val52);
  data0_200704[(alu127+227)] = (((acc0[38]-val30)*val31*alu128)+val33+val53);
  data0_200704[(alu127+280)] = (((acc0[40]-val30)*val31*alu128)+val33+val63);
  data0_200704[(alu127+281)] = (((acc0[42]-val30)*val31*alu128)+val33+val64);
  data0_200704[(alu127+282)] = (((acc0[44]-val30)*val31*alu128)+val33+val65);
  data0_200704[(alu127+283)] = (((acc0[46]-val30)*val31*alu128)+val33+val66);
  data0_200704[(alu127+336)] = (((acc0[48]-val30)*val31*alu128)+val33+val67);
  data0_200704[(alu127+337)] = (((acc0[50]-val30)*val31*alu128)+val33+val68);
  data0_200704[(alu127+338)] = (((acc0[52]-val30)*val31*alu128)+val33+val54);
  data0_200704[(alu127+339)] = (((acc0[54]-val30)*val31*alu128)+val33+val55);
  var alu157 = (1/sqrt((val58+1e-05f)));
  data0_200704[(alu127+100352)] = (((acc0[1]-val56)*val57*alu157)+val59+val60);
  data0_200704[(alu127+100353)] = (((acc0[3]-val56)*val57*alu157)+val59+val61);
  data0_200704[(alu127+100354)] = (((acc0[5]-val56)*val57*alu157)+val59+val62);
  data0_200704[(alu127+100355)] = (((acc0[7]-val56)*val57*alu157)+val59+val69);
  data0_200704[(alu127+100408)] = (((acc0[9]-val56)*val57*alu157)+val59+val70);
  data0_200704[(alu127+100409)] = (((acc0[11]-val56)*val57*alu157)+val59+val71);
  data0_200704[(alu127+100410)] = (((acc0[13]-val56)*val57*alu157)+val59+val72);
  data0_200704[(alu127+100411)] = (((acc0[15]-val56)*val57*alu157)+val59+val73);
  data0_200704[(alu127+100464)] = (((acc0[17]-val56)*val57*alu157)+val59+val74);
  data0_200704[(alu127+100465)] = (((acc0[19]-val56)*val57*alu157)+val59+val75);
  data0_200704[(alu127+100466)] = (((acc0[21]-val56)*val57*alu157)+val59+val76);
  data0_200704[(alu127+100467)] = (((acc0[23]-val56)*val57*alu157)+val59+val77);
  data0_200704[(alu127+100520)] = (((acc0[25]-val56)*val57*alu157)+val59+val78);
  data0_200704[(alu127+100521)] = (((acc0[27]-val56)*val57*alu157)+val59+val79);
  data0_200704[(alu127+100522)] = (((acc0[29]-val56)*val57*alu157)+val59+val80);
  data0_200704[(alu127+100523)] = (((acc0[31]-val56)*val57*alu157)+val59+val81);
  data0_200704[(alu127+100576)] = (((acc0[33]-val56)*val57*alu157)+val59+val82);
  data0_200704[(alu127+100577)] = (((acc0[35]-val56)*val57*alu157)+val59+val83);
  data0_200704[(alu127+100578)] = (((acc0[37]-val56)*val57*alu157)+val59+val84);
  data0_200704[(alu127+100579)] = (((acc0[39]-val56)*val57*alu157)+val59+val85);
  data0_200704[(alu127+100632)] = (((acc0[41]-val56)*val57*alu157)+val59+val86);
  data0_200704[(alu127+100633)] = (((acc0[43]-val56)*val57*alu157)+val59+val87);
  data0_200704[(alu127+100634)] = (((acc0[45]-val56)*val57*alu157)+val59+val88);
  data0_200704[(alu127+100635)] = (((acc0[47]-val56)*val57*alu157)+val59+val89);
  data0_200704[(alu127+100688)] = (((acc0[49]-val56)*val57*alu157)+val59+val90);
  data0_200704[(alu127+100689)] = (((acc0[51]-val56)*val57*alu157)+val59+val91);
  data0_200704[(alu127+100690)] = (((acc0[53]-val56)*val57*alu157)+val59+val92);
  data0_200704[(alu127+100691)] = (((acc0[55]-val56)*val57*alu157)+val59+val93);
}`;

const E_8_3136_8 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_200704:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_200704:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_64:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_64:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_64:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_64:array<f32>;
@compute @workgroup_size(8) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 3136 */
  var gidx1 = i32(gindex.y); /* 8 */
  var lidx0 = i32(lindex.x); /* 8 */
  var alu0 = (gidx0+(gidx1*25088)+(lidx0*3136));
  var val0 = data1_200704[alu0];
  var alu1 = (lidx0+bitcast<i32>((bitcast<u32>(gidx1)<<3u)));
  var val1 = data2_64[alu1];
  var val2 = data3_64[alu1];
  var val3 = data4_64[alu1];
  var val4 = data5_64[alu1];
  data0_200704[alu0] = (((val0-val1)*val2*(1/sqrt((val3+1e-05f))))+val4);
}`;

const r_2_8_56_32_7_64_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_200704:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_200704:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_36864:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_64:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_64:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_64:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_64:array<f32>;
@group(0) @binding(8)var<storage,read_write>data7_64:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,7>;
  var gidx0 = i32(gindex.x); /* 56 */
  var gidx1 = i32(gindex.y); /* 8 */
  var gidx2 = i32(gindex.z); /* 2 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx1*392);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 64; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu8 = (gidx0+Ridx2);
        var alu9 = (alu8+alu0+(Ridx1*56)+(Ridx0*3136));
        var alu10 = ((0<alu8)&(alu8<57));
        var val0 = select(0.0f, data1_200704[(alu9+-57)], (alu10&(0<(gidx1+Ridx1))));
        var val1 = data2_36864[((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx2*18432)+(lidx0*576))];
        var val2 = select(0.0f, data1_200704[(alu9+-1)], alu10);
        var val3 = select(0.0f, data1_200704[(alu9+55)], alu10);
        var val4 = select(0.0f, data1_200704[(alu9+111)], alu10);
        var val5 = select(0.0f, data1_200704[(alu9+167)], alu10);
        var val6 = select(0.0f, data1_200704[(alu9+223)], alu10);
        var val7 = select(0.0f, data1_200704[(alu9+279)], (alu10&(((gidx1*7)+Ridx1)<51)));
        acc0[0] = (acc0[0]+(val0*val1));
        acc0[1] = (acc0[1]+(val2*val1));
        acc0[2] = (acc0[2]+(val3*val1));
        acc0[3] = (acc0[3]+(val4*val1));
        acc0[4] = (acc0[4]+(val5*val1));
        acc0[5] = (acc0[5]+(val6*val1));
        acc0[6] = (acc0[6]+(val7*val1));
      }
    }
  }
  var alu21 = (lidx0+bitcast<i32>((bitcast<u32>(gidx2)<<5u)));
  var val8 = data3_64[alu21];
  var val9 = data4_64[alu21];
  var val10 = data5_64[alu21];
  var val11 = data6_64[alu21];
  var val12 = data7_64[alu21];
  var alu22 = (gidx0+alu0+(gidx2*100352)+(lidx0*3136));
  var alu23 = (1/sqrt((val10+1e-05f)));
  var alu24 = (((acc0[0]-val8)*val9*alu23)+val11);
  var alu25 = (((acc0[1]-val8)*val9*alu23)+val11);
  var alu26 = (((acc0[2]-val8)*val9*alu23)+val11);
  var alu27 = (((acc0[3]-val8)*val9*alu23)+val11);
  var alu28 = (((acc0[4]-val8)*val9*alu23)+val11);
  var alu29 = (((acc0[5]-val8)*val9*alu23)+val11);
  var alu30 = (((acc0[6]-val8)*val9*alu23)+val11);
  var alu31 = select((val12*alu24),alu24,(0.0f<alu24));
  var alu32 = select((val12*alu25),alu25,(0.0f<alu25));
  var alu33 = select((val12*alu26),alu26,(0.0f<alu26));
  var alu34 = select((val12*alu27),alu27,(0.0f<alu27));
  var alu35 = select((val12*alu28),alu28,(0.0f<alu28));
  var alu36 = select((val12*alu29),alu29,(0.0f<alu29));
  var alu37 = select((val12*alu30),alu30,(0.0f<alu30));
  data0_200704[alu22] = alu31;
  data0_200704[(alu22+56)] = alu32;
  data0_200704[(alu22+112)] = alu33;
  data0_200704[(alu22+168)] = alu34;
  data0_200704[(alu22+224)] = alu35;
  data0_200704[(alu22+280)] = alu36;
  data0_200704[(alu22+336)] = alu37;
}`;

const r_2_8_56_32_7_64_3_3n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_200704:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_200704:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_36864:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_64:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_64:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_64:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_64:array<f32>;
@group(0) @binding(8)var<storage,read_write>data7_200704:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,7>;
  var gidx0 = i32(gindex.x); /* 56 */
  var gidx1 = i32(gindex.y); /* 8 */
  var gidx2 = i32(gindex.z); /* 2 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx1*392);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 64; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu8 = (gidx0+Ridx2);
        var alu9 = (alu8+alu0+(Ridx1*56)+(Ridx0*3136));
        var alu10 = ((0<alu8)&(alu8<57));
        var val0 = select(0.0f, data1_200704[(alu9+-57)], (alu10&(0<(gidx1+Ridx1))));
        var val1 = data2_36864[((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx2*18432)+(lidx0*576))];
        var val2 = select(0.0f, data1_200704[(alu9+-1)], alu10);
        var val3 = select(0.0f, data1_200704[(alu9+55)], alu10);
        var val4 = select(0.0f, data1_200704[(alu9+111)], alu10);
        var val5 = select(0.0f, data1_200704[(alu9+167)], alu10);
        var val6 = select(0.0f, data1_200704[(alu9+223)], alu10);
        var val7 = select(0.0f, data1_200704[(alu9+279)], (alu10&(((gidx1*7)+Ridx1)<51)));
        acc0[0] = (acc0[0]+(val0*val1));
        acc0[1] = (acc0[1]+(val2*val1));
        acc0[2] = (acc0[2]+(val3*val1));
        acc0[3] = (acc0[3]+(val4*val1));
        acc0[4] = (acc0[4]+(val5*val1));
        acc0[5] = (acc0[5]+(val6*val1));
        acc0[6] = (acc0[6]+(val7*val1));
      }
    }
  }
  var alu21 = (lidx0+bitcast<i32>((bitcast<u32>(gidx2)<<5u)));
  var val8 = data3_64[alu21];
  var val9 = data4_64[alu21];
  var val10 = data5_64[alu21];
  var val11 = data6_64[alu21];
  var alu22 = (gidx0+alu0+(gidx2*100352)+(lidx0*3136));
  var val12 = data7_200704[alu22];
  var alu23 = (alu22+56);
  var val13 = data7_200704[alu23];
  var alu24 = (alu22+112);
  var val14 = data7_200704[alu24];
  var alu25 = (alu22+168);
  var val15 = data7_200704[alu25];
  var alu26 = (alu22+224);
  var val16 = data7_200704[alu26];
  var alu27 = (alu22+280);
  var val17 = data7_200704[alu27];
  var alu28 = (alu22+336);
  var val18 = data7_200704[alu28];
  var alu29 = (1/sqrt((val10+1e-05f)));
  data0_200704[alu22] = (((acc0[0]-val8)*val9*alu29)+val11+val12);
  data0_200704[alu23] = (((acc0[1]-val8)*val9*alu29)+val11+val13);
  data0_200704[alu24] = (((acc0[2]-val8)*val9*alu29)+val11+val14);
  data0_200704[alu25] = (((acc0[3]-val8)*val9*alu29)+val11+val15);
  data0_200704[alu26] = (((acc0[4]-val8)*val9*alu29)+val11+val16);
  data0_200704[alu27] = (((acc0[5]-val8)*val9*alu29)+val11+val17);
  data0_200704[alu28] = (((acc0[6]-val8)*val9*alu29)+val11+val18);
}`;

const r_28_28_8_16_64 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_100352:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_200704:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_8192:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_128:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_128:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_128:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_128:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,1>;
  var gidx0 = i32(gindex.x); /* 8 */
  var gidx1 = i32(gindex.y); /* 28 */
  var gidx2 = i32(gindex.z); /* 28 */
  var lidx0 = i32(lindex.x); /* 16 */
  var cast0 = bitcast<u32>(gidx0);
  var cast1 = bitcast<u32>(gidx1);
  acc0[0] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 64; Ridx0++) {
    var val0 = data1_200704[(bitcast<i32>((cast1<<1u))+(gidx2*112)+(Ridx0*3136))];
    var val1 = data2_8192[(bitcast<i32>((cast0<<10u))+bitcast<i32>((bitcast<u32>(lidx0)<<6u))+Ridx0)];
    acc0[0] = (acc0[0]+(val0*val1));
  }
  var alu3 = (lidx0+bitcast<i32>((cast0<<4u)));
  var val2 = data3_128[alu3];
  var val3 = data4_128[alu3];
  var val4 = data5_128[alu3];
  var val5 = data6_128[alu3];
  data0_100352[(alu3+bitcast<i32>((cast1<<7u))+(gidx2*3584))] = (((acc0[0]-val2)*val3*(1/sqrt((val4+1e-05f))))+val5);
}`;

const r_4_56_32_7_8_64_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_401408:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_200704:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_73728:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_128:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_128:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_128:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_128:array<f32>;
@group(0) @binding(8)var<storage,read_write>data7_128:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,56>;
  var gidx0 = i32(gindex.x); /* 56 */
  var gidx1 = i32(gindex.y); /* 4 */
  var lidx0 = i32(lindex.x); /* 32 */
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  acc0[7] = 0.0f;
  acc0[8] = 0.0f;
  acc0[9] = 0.0f;
  acc0[10] = 0.0f;
  acc0[11] = 0.0f;
  acc0[12] = 0.0f;
  acc0[13] = 0.0f;
  acc0[14] = 0.0f;
  acc0[15] = 0.0f;
  acc0[16] = 0.0f;
  acc0[17] = 0.0f;
  acc0[18] = 0.0f;
  acc0[19] = 0.0f;
  acc0[20] = 0.0f;
  acc0[21] = 0.0f;
  acc0[22] = 0.0f;
  acc0[23] = 0.0f;
  acc0[24] = 0.0f;
  acc0[25] = 0.0f;
  acc0[26] = 0.0f;
  acc0[27] = 0.0f;
  acc0[28] = 0.0f;
  acc0[29] = 0.0f;
  acc0[30] = 0.0f;
  acc0[31] = 0.0f;
  acc0[32] = 0.0f;
  acc0[33] = 0.0f;
  acc0[34] = 0.0f;
  acc0[35] = 0.0f;
  acc0[36] = 0.0f;
  acc0[37] = 0.0f;
  acc0[38] = 0.0f;
  acc0[39] = 0.0f;
  acc0[40] = 0.0f;
  acc0[41] = 0.0f;
  acc0[42] = 0.0f;
  acc0[43] = 0.0f;
  acc0[44] = 0.0f;
  acc0[45] = 0.0f;
  acc0[46] = 0.0f;
  acc0[47] = 0.0f;
  acc0[48] = 0.0f;
  acc0[49] = 0.0f;
  acc0[50] = 0.0f;
  acc0[51] = 0.0f;
  acc0[52] = 0.0f;
  acc0[53] = 0.0f;
  acc0[54] = 0.0f;
  acc0[55] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 64; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu56 = (gidx0+Ridx2);
        var alu57 = (alu56+(Ridx1*56)+(Ridx0*3136));
        var alu58 = ((0<alu56)&(alu56<57));
        var val0 = select(0.0f, data1_200704[(alu57+-57)], (alu58&(0<Ridx1)));
        var val1 = data2_73728[((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx1*18432)+(lidx0*576))];
        var val2 = select(0.0f, data1_200704[(alu57+335)], alu58);
        var val3 = select(0.0f, data1_200704[(alu57+447)], alu58);
        var val4 = select(0.0f, data1_200704[(alu57+727)], alu58);
        var val5 = select(0.0f, data1_200704[(alu57+1119)], alu58);
        var val6 = select(0.0f, data1_200704[(alu57+1511)], alu58);
        var val7 = select(0.0f, data1_200704[(alu57+1903)], alu58);
        var val8 = select(0.0f, data1_200704[(alu57+2295)], alu58);
        var val9 = select(0.0f, data1_200704[(alu57+-1)], alu58);
        var val10 = select(0.0f, data1_200704[(alu57+391)], alu58);
        var val11 = select(0.0f, data1_200704[(alu57+783)], alu58);
        var val12 = select(0.0f, data1_200704[(alu57+2687)], alu58);
        var val13 = select(0.0f, data1_200704[(alu57+1175)], alu58);
        var val14 = select(0.0f, data1_200704[(alu57+1567)], alu58);
        var val15 = select(0.0f, data1_200704[(alu57+1959)], alu58);
        var val16 = select(0.0f, data1_200704[(alu57+2351)], alu58);
        var val17 = select(0.0f, data1_200704[(alu57+2743)], alu58);
        var val18 = select(0.0f, data1_200704[(alu57+55)], alu58);
        var val19 = select(0.0f, data1_200704[(alu57+839)], alu58);
        var val20 = select(0.0f, data1_200704[(alu57+1231)], alu58);
        var val21 = select(0.0f, data1_200704[(alu57+1623)], alu58);
        var val22 = select(0.0f, data1_200704[(alu57+2015)], alu58);
        var val23 = select(0.0f, data1_200704[(alu57+111)], alu58);
        var val24 = select(0.0f, data1_200704[(alu57+2407)], alu58);
        var val25 = select(0.0f, data1_200704[(alu57+503)], alu58);
        var val26 = select(0.0f, data1_200704[(alu57+1679)], alu58);
        var val27 = select(0.0f, data1_200704[(alu57+2071)], alu58);
        var val28 = select(0.0f, data1_200704[(alu57+2463)], alu58);
        var val29 = select(0.0f, data1_200704[(alu57+2855)], alu58);
        var val30 = select(0.0f, data1_200704[(alu57+167)], alu58);
        var val31 = select(0.0f, data1_200704[(alu57+559)], alu58);
        var val32 = select(0.0f, data1_200704[(alu57+951)], alu58);
        var val33 = select(0.0f, data1_200704[(alu57+1343)], alu58);
        var val34 = select(0.0f, data1_200704[(alu57+1735)], alu58);
        var val35 = select(0.0f, data1_200704[(alu57+2127)], alu58);
        var val36 = select(0.0f, data1_200704[(alu57+2799)], alu58);
        var val37 = select(0.0f, data1_200704[(alu57+895)], alu58);
        var val38 = select(0.0f, data1_200704[(alu57+2519)], alu58);
        var val39 = select(0.0f, data1_200704[(alu57+223)], alu58);
        var val40 = select(0.0f, data1_200704[(alu57+615)], alu58);
        var val41 = select(0.0f, data1_200704[(alu57+1007)], alu58);
        var val42 = select(0.0f, data1_200704[(alu57+1287)], alu58);
        var val43 = select(0.0f, data1_200704[(alu57+2911)], alu58);
        var val44 = select(0.0f, data1_200704[(alu57+1399)], alu58);
        var val45 = select(0.0f, data1_200704[(alu57+1791)], alu58);
        var val46 = select(0.0f, data1_200704[(alu57+2183)], alu58);
        var val47 = select(0.0f, data1_200704[(alu57+2575)], alu58);
        var val48 = select(0.0f, data1_200704[(alu57+2967)], alu58);
        var val49 = select(0.0f, data1_200704[(alu57+279)], alu58);
        var val50 = select(0.0f, data1_200704[(alu57+671)], alu58);
        var val51 = select(0.0f, data1_200704[(alu57+1063)], alu58);
        var val52 = select(0.0f, data1_200704[(alu57+1455)], alu58);
        var val53 = select(0.0f, data1_200704[(alu57+1847)], alu58);
        var val54 = select(0.0f, data1_200704[(alu57+2239)], alu58);
        var val55 = select(0.0f, data1_200704[(alu57+2631)], alu58);
        var val56 = select(0.0f, data1_200704[(alu57+3023)], (alu58&(Ridx1<2)));
        acc0[0] = (acc0[0]+(val0*val1));
        acc0[1] = (acc0[1]+(val2*val1));
        acc0[2] = (acc0[2]+(val4*val1));
        acc0[3] = (acc0[3]+(val5*val1));
        acc0[4] = (acc0[4]+(val6*val1));
        acc0[5] = (acc0[5]+(val7*val1));
        acc0[6] = (acc0[6]+(val8*val1));
        acc0[7] = (acc0[7]+(val12*val1));
        acc0[8] = (acc0[8]+(val9*val1));
        acc0[9] = (acc0[9]+(val10*val1));
        acc0[10] = (acc0[10]+(val11*val1));
        acc0[11] = (acc0[11]+(val13*val1));
        acc0[12] = (acc0[12]+(val14*val1));
        acc0[13] = (acc0[13]+(val15*val1));
        acc0[14] = (acc0[14]+(val16*val1));
        acc0[15] = (acc0[15]+(val17*val1));
        acc0[16] = (acc0[16]+(val18*val1));
        acc0[17] = (acc0[17]+(val3*val1));
        acc0[18] = (acc0[18]+(val19*val1));
        acc0[19] = (acc0[19]+(val20*val1));
        acc0[20] = (acc0[20]+(val21*val1));
        acc0[21] = (acc0[21]+(val22*val1));
        acc0[22] = (acc0[22]+(val24*val1));
        acc0[23] = (acc0[23]+(val36*val1));
        acc0[24] = (acc0[24]+(val23*val1));
        acc0[25] = (acc0[25]+(val25*val1));
        acc0[26] = (acc0[26]+(val37*val1));
        acc0[27] = (acc0[27]+(val42*val1));
        acc0[28] = (acc0[28]+(val26*val1));
        acc0[29] = (acc0[29]+(val27*val1));
        acc0[30] = (acc0[30]+(val28*val1));
        acc0[31] = (acc0[31]+(val29*val1));
        acc0[32] = (acc0[32]+(val30*val1));
        acc0[33] = (acc0[33]+(val31*val1));
        acc0[34] = (acc0[34]+(val32*val1));
        acc0[35] = (acc0[35]+(val33*val1));
        acc0[36] = (acc0[36]+(val34*val1));
        acc0[37] = (acc0[37]+(val35*val1));
        acc0[38] = (acc0[38]+(val38*val1));
        acc0[39] = (acc0[39]+(val43*val1));
        acc0[40] = (acc0[40]+(val39*val1));
        acc0[41] = (acc0[41]+(val40*val1));
        acc0[42] = (acc0[42]+(val41*val1));
        acc0[43] = (acc0[43]+(val44*val1));
        acc0[44] = (acc0[44]+(val45*val1));
        acc0[45] = (acc0[45]+(val46*val1));
        acc0[46] = (acc0[46]+(val47*val1));
        acc0[47] = (acc0[47]+(val48*val1));
        acc0[48] = (acc0[48]+(val49*val1));
        acc0[49] = (acc0[49]+(val50*val1));
        acc0[50] = (acc0[50]+(val51*val1));
        acc0[51] = (acc0[51]+(val52*val1));
        acc0[52] = (acc0[52]+(val53*val1));
        acc0[53] = (acc0[53]+(val54*val1));
        acc0[54] = (acc0[54]+(val55*val1));
        acc0[55] = (acc0[55]+(val56*val1));
      }
    }
  }
  var alu118 = (lidx0+bitcast<i32>((bitcast<u32>(gidx1)<<5u)));
  var val57 = data3_128[alu118];
  var val58 = data4_128[alu118];
  var val59 = data5_128[alu118];
  var val60 = data6_128[alu118];
  var val61 = data7_128[alu118];
  var alu119 = (gidx0+(gidx1*100352)+(lidx0*3136));
  var alu120 = (1/sqrt((val59+1e-05f)));
  var alu121 = (((acc0[0]-val57)*val58*alu120)+val60);
  var alu122 = (((acc0[1]-val57)*val58*alu120)+val60);
  var alu123 = (((acc0[2]-val57)*val58*alu120)+val60);
  var alu124 = (((acc0[3]-val57)*val58*alu120)+val60);
  var alu125 = (((acc0[4]-val57)*val58*alu120)+val60);
  var alu126 = (((acc0[5]-val57)*val58*alu120)+val60);
  var alu127 = (((acc0[6]-val57)*val58*alu120)+val60);
  var alu128 = (((acc0[7]-val57)*val58*alu120)+val60);
  var alu129 = (((acc0[8]-val57)*val58*alu120)+val60);
  var alu130 = (((acc0[9]-val57)*val58*alu120)+val60);
  var alu131 = (((acc0[10]-val57)*val58*alu120)+val60);
  var alu132 = (((acc0[11]-val57)*val58*alu120)+val60);
  var alu133 = (((acc0[12]-val57)*val58*alu120)+val60);
  var alu134 = (((acc0[13]-val57)*val58*alu120)+val60);
  var alu135 = (((acc0[14]-val57)*val58*alu120)+val60);
  var alu136 = (((acc0[15]-val57)*val58*alu120)+val60);
  var alu137 = (((acc0[16]-val57)*val58*alu120)+val60);
  var alu138 = (((acc0[17]-val57)*val58*alu120)+val60);
  var alu139 = (((acc0[18]-val57)*val58*alu120)+val60);
  var alu140 = (((acc0[19]-val57)*val58*alu120)+val60);
  var alu141 = (((acc0[20]-val57)*val58*alu120)+val60);
  var alu142 = (((acc0[21]-val57)*val58*alu120)+val60);
  var alu143 = (((acc0[22]-val57)*val58*alu120)+val60);
  var alu144 = (((acc0[23]-val57)*val58*alu120)+val60);
  var alu145 = (((acc0[24]-val57)*val58*alu120)+val60);
  var alu146 = (((acc0[25]-val57)*val58*alu120)+val60);
  var alu147 = (((acc0[26]-val57)*val58*alu120)+val60);
  var alu148 = (((acc0[27]-val57)*val58*alu120)+val60);
  var alu149 = (((acc0[28]-val57)*val58*alu120)+val60);
  var alu150 = (((acc0[29]-val57)*val58*alu120)+val60);
  var alu151 = (((acc0[30]-val57)*val58*alu120)+val60);
  var alu152 = (((acc0[31]-val57)*val58*alu120)+val60);
  var alu153 = (((acc0[32]-val57)*val58*alu120)+val60);
  var alu154 = (((acc0[33]-val57)*val58*alu120)+val60);
  var alu155 = (((acc0[34]-val57)*val58*alu120)+val60);
  var alu156 = (((acc0[35]-val57)*val58*alu120)+val60);
  var alu157 = (((acc0[36]-val57)*val58*alu120)+val60);
  var alu158 = (((acc0[37]-val57)*val58*alu120)+val60);
  var alu159 = (((acc0[38]-val57)*val58*alu120)+val60);
  var alu160 = (((acc0[39]-val57)*val58*alu120)+val60);
  var alu161 = (((acc0[40]-val57)*val58*alu120)+val60);
  var alu162 = (((acc0[41]-val57)*val58*alu120)+val60);
  var alu163 = (((acc0[42]-val57)*val58*alu120)+val60);
  var alu164 = (((acc0[43]-val57)*val58*alu120)+val60);
  var alu165 = (((acc0[44]-val57)*val58*alu120)+val60);
  var alu166 = (((acc0[45]-val57)*val58*alu120)+val60);
  var alu167 = (((acc0[46]-val57)*val58*alu120)+val60);
  var alu168 = (((acc0[47]-val57)*val58*alu120)+val60);
  var alu169 = (((acc0[48]-val57)*val58*alu120)+val60);
  var alu170 = (((acc0[49]-val57)*val58*alu120)+val60);
  var alu171 = (((acc0[50]-val57)*val58*alu120)+val60);
  var alu172 = (((acc0[51]-val57)*val58*alu120)+val60);
  var alu173 = (((acc0[52]-val57)*val58*alu120)+val60);
  var alu174 = (((acc0[53]-val57)*val58*alu120)+val60);
  var alu175 = (((acc0[54]-val57)*val58*alu120)+val60);
  var alu176 = (((acc0[55]-val57)*val58*alu120)+val60);
  var alu177 = select((val61*alu121),alu121,(0.0f<alu121));
  var alu178 = select((val61*alu122),alu122,(0.0f<alu122));
  var alu179 = select((val61*alu123),alu123,(0.0f<alu123));
  var alu180 = select((val61*alu124),alu124,(0.0f<alu124));
  var alu181 = select((val61*alu125),alu125,(0.0f<alu125));
  var alu182 = select((val61*alu126),alu126,(0.0f<alu126));
  var alu183 = select((val61*alu127),alu127,(0.0f<alu127));
  var alu184 = select((val61*alu128),alu128,(0.0f<alu128));
  var alu185 = select((val61*alu129),alu129,(0.0f<alu129));
  var alu186 = select((val61*alu130),alu130,(0.0f<alu130));
  var alu187 = select((val61*alu131),alu131,(0.0f<alu131));
  var alu188 = select((val61*alu132),alu132,(0.0f<alu132));
  var alu189 = select((val61*alu133),alu133,(0.0f<alu133));
  var alu190 = select((val61*alu134),alu134,(0.0f<alu134));
  var alu191 = select((val61*alu135),alu135,(0.0f<alu135));
  var alu192 = select((val61*alu136),alu136,(0.0f<alu136));
  var alu193 = select((val61*alu137),alu137,(0.0f<alu137));
  var alu194 = select((val61*alu138),alu138,(0.0f<alu138));
  var alu195 = select((val61*alu139),alu139,(0.0f<alu139));
  var alu196 = select((val61*alu140),alu140,(0.0f<alu140));
  var alu197 = select((val61*alu141),alu141,(0.0f<alu141));
  var alu198 = select((val61*alu142),alu142,(0.0f<alu142));
  var alu199 = select((val61*alu143),alu143,(0.0f<alu143));
  var alu200 = select((val61*alu144),alu144,(0.0f<alu144));
  var alu201 = select((val61*alu145),alu145,(0.0f<alu145));
  var alu202 = select((val61*alu146),alu146,(0.0f<alu146));
  var alu203 = select((val61*alu147),alu147,(0.0f<alu147));
  var alu204 = select((val61*alu148),alu148,(0.0f<alu148));
  var alu205 = select((val61*alu149),alu149,(0.0f<alu149));
  var alu206 = select((val61*alu150),alu150,(0.0f<alu150));
  var alu207 = select((val61*alu151),alu151,(0.0f<alu151));
  var alu208 = select((val61*alu152),alu152,(0.0f<alu152));
  var alu209 = select((val61*alu153),alu153,(0.0f<alu153));
  var alu210 = select((val61*alu154),alu154,(0.0f<alu154));
  var alu211 = select((val61*alu155),alu155,(0.0f<alu155));
  var alu212 = select((val61*alu156),alu156,(0.0f<alu156));
  var alu213 = select((val61*alu157),alu157,(0.0f<alu157));
  var alu214 = select((val61*alu158),alu158,(0.0f<alu158));
  var alu215 = select((val61*alu159),alu159,(0.0f<alu159));
  var alu216 = select((val61*alu160),alu160,(0.0f<alu160));
  var alu217 = select((val61*alu161),alu161,(0.0f<alu161));
  var alu218 = select((val61*alu162),alu162,(0.0f<alu162));
  var alu219 = select((val61*alu163),alu163,(0.0f<alu163));
  var alu220 = select((val61*alu164),alu164,(0.0f<alu164));
  var alu221 = select((val61*alu165),alu165,(0.0f<alu165));
  var alu222 = select((val61*alu166),alu166,(0.0f<alu166));
  var alu223 = select((val61*alu167),alu167,(0.0f<alu167));
  var alu224 = select((val61*alu168),alu168,(0.0f<alu168));
  var alu225 = select((val61*alu169),alu169,(0.0f<alu169));
  var alu226 = select((val61*alu170),alu170,(0.0f<alu170));
  var alu227 = select((val61*alu171),alu171,(0.0f<alu171));
  var alu228 = select((val61*alu172),alu172,(0.0f<alu172));
  var alu229 = select((val61*alu173),alu173,(0.0f<alu173));
  var alu230 = select((val61*alu174),alu174,(0.0f<alu174));
  var alu231 = select((val61*alu175),alu175,(0.0f<alu175));
  var alu232 = select((val61*alu176),alu176,(0.0f<alu176));
  data0_401408[alu119] = alu177;
  data0_401408[(alu119+56)] = alu185;
  data0_401408[(alu119+112)] = alu193;
  data0_401408[(alu119+168)] = alu201;
  data0_401408[(alu119+224)] = alu209;
  data0_401408[(alu119+280)] = alu217;
  data0_401408[(alu119+336)] = alu225;
  data0_401408[(alu119+392)] = alu178;
  data0_401408[(alu119+448)] = alu186;
  data0_401408[(alu119+504)] = alu194;
  data0_401408[(alu119+560)] = alu202;
  data0_401408[(alu119+616)] = alu210;
  data0_401408[(alu119+672)] = alu218;
  data0_401408[(alu119+728)] = alu226;
  data0_401408[(alu119+784)] = alu179;
  data0_401408[(alu119+840)] = alu187;
  data0_401408[(alu119+896)] = alu195;
  data0_401408[(alu119+952)] = alu203;
  data0_401408[(alu119+1008)] = alu211;
  data0_401408[(alu119+1064)] = alu219;
  data0_401408[(alu119+1120)] = alu227;
  data0_401408[(alu119+1176)] = alu180;
  data0_401408[(alu119+1232)] = alu188;
  data0_401408[(alu119+1288)] = alu196;
  data0_401408[(alu119+1344)] = alu204;
  data0_401408[(alu119+1400)] = alu212;
  data0_401408[(alu119+1456)] = alu220;
  data0_401408[(alu119+1512)] = alu228;
  data0_401408[(alu119+1568)] = alu181;
  data0_401408[(alu119+1624)] = alu189;
  data0_401408[(alu119+1680)] = alu197;
  data0_401408[(alu119+1736)] = alu205;
  data0_401408[(alu119+1792)] = alu213;
  data0_401408[(alu119+1848)] = alu221;
  data0_401408[(alu119+1904)] = alu229;
  data0_401408[(alu119+1960)] = alu182;
  data0_401408[(alu119+2016)] = alu190;
  data0_401408[(alu119+2072)] = alu198;
  data0_401408[(alu119+2128)] = alu206;
  data0_401408[(alu119+2184)] = alu214;
  data0_401408[(alu119+2240)] = alu222;
  data0_401408[(alu119+2296)] = alu230;
  data0_401408[(alu119+2352)] = alu183;
  data0_401408[(alu119+2408)] = alu191;
  data0_401408[(alu119+2464)] = alu199;
  data0_401408[(alu119+2520)] = alu207;
  data0_401408[(alu119+2576)] = alu215;
  data0_401408[(alu119+2632)] = alu223;
  data0_401408[(alu119+2688)] = alu231;
  data0_401408[(alu119+2744)] = alu184;
  data0_401408[(alu119+2800)] = alu192;
  data0_401408[(alu119+2856)] = alu200;
  data0_401408[(alu119+2912)] = alu208;
  data0_401408[(alu119+2968)] = alu216;
  data0_401408[(alu119+3024)] = alu224;
  data0_401408[(alu119+3080)] = alu232;
}`;

const r_14_4_2_16_7_2_4_128_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_100352:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_401408:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_147456:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_128:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_128:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_128:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_128:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,56>;
  var gidx0 = i32(gindex.x); /* 2 */
  var gidx1 = i32(gindex.y); /* 4 */
  var gidx2 = i32(gindex.z); /* 14 */
  var lidx0 = i32(lindex.x); /* 16 */
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  acc0[7] = 0.0f;
  acc0[8] = 0.0f;
  acc0[9] = 0.0f;
  acc0[10] = 0.0f;
  acc0[11] = 0.0f;
  acc0[12] = 0.0f;
  acc0[13] = 0.0f;
  acc0[14] = 0.0f;
  acc0[15] = 0.0f;
  acc0[16] = 0.0f;
  acc0[17] = 0.0f;
  acc0[18] = 0.0f;
  acc0[19] = 0.0f;
  acc0[20] = 0.0f;
  acc0[21] = 0.0f;
  acc0[22] = 0.0f;
  acc0[23] = 0.0f;
  acc0[24] = 0.0f;
  acc0[25] = 0.0f;
  acc0[26] = 0.0f;
  acc0[27] = 0.0f;
  acc0[28] = 0.0f;
  acc0[29] = 0.0f;
  acc0[30] = 0.0f;
  acc0[31] = 0.0f;
  acc0[32] = 0.0f;
  acc0[33] = 0.0f;
  acc0[34] = 0.0f;
  acc0[35] = 0.0f;
  acc0[36] = 0.0f;
  acc0[37] = 0.0f;
  acc0[38] = 0.0f;
  acc0[39] = 0.0f;
  acc0[40] = 0.0f;
  acc0[41] = 0.0f;
  acc0[42] = 0.0f;
  acc0[43] = 0.0f;
  acc0[44] = 0.0f;
  acc0[45] = 0.0f;
  acc0[46] = 0.0f;
  acc0[47] = 0.0f;
  acc0[48] = 0.0f;
  acc0[49] = 0.0f;
  acc0[50] = 0.0f;
  acc0[51] = 0.0f;
  acc0[52] = 0.0f;
  acc0[53] = 0.0f;
  acc0[54] = 0.0f;
  acc0[55] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 128; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu56 = (bitcast<i32>((bitcast<u32>(gidx2)<<2u))+Ridx1+(Ridx0*56)+-1);
      var alu57 = select(0,1,(alu56<0));
      var alu58 = (0<(gidx2+Ridx1));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu59 = ((gidx1*14)+Ridx2);
        var alu60 = (alu59+(gidx2*224)+(Ridx1*56)+(Ridx0*3136));
        var alu61 = (alu60+-57);
        var alu62 = select(0,63,(alu61<0));
        var alu63 = (0<(gidx1+Ridx2));
        var val0 = select(0.0f, data1_401408[(alu59+((alu56-(56*(((alu56*9363)>>19u)+alu57)))*56)+(((((alu61+alu62)>>6u)*2675)>>17u)*3136)+-1)], (alu63&alu58));
        var alu64 = ((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx0*73728)+(lidx0*1152));
        var val1 = data2_147456[(alu64+18432)];
        var val2 = data2_147456[alu64];
        var val3 = data2_147456[(alu64+36864)];
        var val4 = data2_147456[(alu64+55296)];
        var val5 = select(0.0f, data1_401408[(alu60+55)], alu63);
        var val6 = select(0.0f, data1_401408[(alu60+-55)], alu58);
        var val7 = data1_401408[(alu60+57)];
        var val8 = select(0.0f, data1_401408[(alu60+-53)], alu58);
        var val9 = data1_401408[(alu60+59)];
        var val10 = select(0.0f, data1_401408[(alu60+-51)], alu58);
        var val11 = data1_401408[(alu60+61)];
        var val12 = select(0.0f, data1_401408[(alu60+-49)], alu58);
        var val13 = data1_401408[(alu60+63)];
        var val14 = select(0.0f, data1_401408[(alu60+-47)], alu58);
        var val15 = data1_401408[(alu60+65)];
        var val16 = select(0.0f, data1_401408[(alu60+-45)], alu58);
        var val17 = data1_401408[(alu60+67)];
        acc0[0] = (acc0[0]+(val0*val2));
        acc0[1] = (acc0[1]+(val0*val1));
        acc0[2] = (acc0[2]+(val0*val3));
        acc0[3] = (acc0[3]+(val0*val4));
        acc0[4] = (acc0[4]+(val5*val2));
        acc0[5] = (acc0[5]+(val5*val1));
        acc0[6] = (acc0[6]+(val5*val3));
        acc0[7] = (acc0[7]+(val5*val4));
        acc0[8] = (acc0[8]+(val6*val2));
        acc0[9] = (acc0[9]+(val6*val1));
        acc0[10] = (acc0[10]+(val6*val3));
        acc0[11] = (acc0[11]+(val6*val4));
        acc0[12] = (acc0[12]+(val7*val2));
        acc0[13] = (acc0[13]+(val7*val1));
        acc0[14] = (acc0[14]+(val7*val3));
        acc0[15] = (acc0[15]+(val7*val4));
        acc0[16] = (acc0[16]+(val8*val2));
        acc0[17] = (acc0[17]+(val8*val1));
        acc0[18] = (acc0[18]+(val8*val3));
        acc0[19] = (acc0[19]+(val8*val4));
        acc0[20] = (acc0[20]+(val9*val2));
        acc0[21] = (acc0[21]+(val9*val1));
        acc0[22] = (acc0[22]+(val9*val3));
        acc0[23] = (acc0[23]+(val9*val4));
        acc0[24] = (acc0[24]+(val10*val2));
        acc0[25] = (acc0[25]+(val10*val1));
        acc0[26] = (acc0[26]+(val10*val3));
        acc0[27] = (acc0[27]+(val10*val4));
        acc0[28] = (acc0[28]+(val11*val2));
        acc0[29] = (acc0[29]+(val11*val1));
        acc0[30] = (acc0[30]+(val11*val3));
        acc0[31] = (acc0[31]+(val11*val4));
        acc0[32] = (acc0[32]+(val12*val2));
        acc0[33] = (acc0[33]+(val12*val1));
        acc0[34] = (acc0[34]+(val12*val3));
        acc0[35] = (acc0[35]+(val12*val4));
        acc0[36] = (acc0[36]+(val13*val2));
        acc0[37] = (acc0[37]+(val13*val1));
        acc0[38] = (acc0[38]+(val13*val3));
        acc0[39] = (acc0[39]+(val13*val4));
        acc0[40] = (acc0[40]+(val14*val2));
        acc0[41] = (acc0[41]+(val14*val1));
        acc0[42] = (acc0[42]+(val14*val3));
        acc0[43] = (acc0[43]+(val14*val4));
        acc0[44] = (acc0[44]+(val15*val2));
        acc0[45] = (acc0[45]+(val15*val1));
        acc0[46] = (acc0[46]+(val15*val3));
        acc0[47] = (acc0[47]+(val15*val4));
        acc0[48] = (acc0[48]+(val16*val2));
        acc0[49] = (acc0[49]+(val16*val1));
        acc0[50] = (acc0[50]+(val16*val3));
        acc0[51] = (acc0[51]+(val16*val4));
        acc0[52] = (acc0[52]+(val17*val2));
        acc0[53] = (acc0[53]+(val17*val1));
        acc0[54] = (acc0[54]+(val17*val3));
        acc0[55] = (acc0[55]+(val17*val4));
      }
    }
  }
  var alu124 = (lidx0+bitcast<i32>((bitcast<u32>(gidx0)<<6u)));
  var val18 = data3_128[alu124];
  var alu125 = (alu124+16);
  var val19 = data3_128[alu125];
  var val20 = data4_128[alu124];
  var val21 = data4_128[alu125];
  var val22 = data5_128[alu124];
  var val23 = data6_128[alu124];
  var val24 = data5_128[alu125];
  var val25 = data6_128[alu125];
  var alu126 = (alu124+32);
  var val26 = data3_128[alu126];
  var alu127 = (alu124+48);
  var val27 = data3_128[alu127];
  var val28 = data4_128[alu126];
  var val29 = data4_128[alu127];
  var val30 = data5_128[alu126];
  var val31 = data5_128[alu127];
  var val32 = data6_128[alu126];
  var val33 = data6_128[alu127];
  var alu128 = (alu124+(gidx1*896)+(gidx2*7168));
  var alu129 = (1/sqrt((val22+1e-05f)));
  var alu130 = (1/sqrt((val24+1e-05f)));
  var alu131 = (1/sqrt((val30+1e-05f)));
  var alu132 = (1/sqrt((val31+1e-05f)));
  data0_100352[alu128] = (((acc0[0]-val18)*val20*alu129)+val23);
  data0_100352[(alu128+16)] = (((acc0[1]-val19)*val21*alu130)+val25);
  data0_100352[(alu128+32)] = (((acc0[2]-val26)*val28*alu131)+val32);
  data0_100352[(alu128+48)] = (((acc0[3]-val27)*val29*alu132)+val33);
  data0_100352[(alu128+128)] = (((acc0[8]-val18)*val20*alu129)+val23);
  data0_100352[(alu128+144)] = (((acc0[9]-val19)*val21*alu130)+val25);
  data0_100352[(alu128+160)] = (((acc0[10]-val26)*val28*alu131)+val32);
  data0_100352[(alu128+176)] = (((acc0[11]-val27)*val29*alu132)+val33);
  data0_100352[(alu128+256)] = (((acc0[16]-val18)*val20*alu129)+val23);
  data0_100352[(alu128+272)] = (((acc0[17]-val19)*val21*alu130)+val25);
  data0_100352[(alu128+288)] = (((acc0[18]-val26)*val28*alu131)+val32);
  data0_100352[(alu128+304)] = (((acc0[19]-val27)*val29*alu132)+val33);
  data0_100352[(alu128+384)] = (((acc0[24]-val18)*val20*alu129)+val23);
  data0_100352[(alu128+400)] = (((acc0[25]-val19)*val21*alu130)+val25);
  data0_100352[(alu128+416)] = (((acc0[26]-val26)*val28*alu131)+val32);
  data0_100352[(alu128+432)] = (((acc0[27]-val27)*val29*alu132)+val33);
  data0_100352[(alu128+512)] = (((acc0[32]-val18)*val20*alu129)+val23);
  data0_100352[(alu128+528)] = (((acc0[33]-val19)*val21*alu130)+val25);
  data0_100352[(alu128+544)] = (((acc0[34]-val26)*val28*alu131)+val32);
  data0_100352[(alu128+560)] = (((acc0[35]-val27)*val29*alu132)+val33);
  data0_100352[(alu128+640)] = (((acc0[40]-val18)*val20*alu129)+val23);
  data0_100352[(alu128+656)] = (((acc0[41]-val19)*val21*alu130)+val25);
  data0_100352[(alu128+672)] = (((acc0[42]-val26)*val28*alu131)+val32);
  data0_100352[(alu128+688)] = (((acc0[43]-val27)*val29*alu132)+val33);
  data0_100352[(alu128+768)] = (((acc0[48]-val18)*val20*alu129)+val23);
  data0_100352[(alu128+784)] = (((acc0[49]-val19)*val21*alu130)+val25);
  data0_100352[(alu128+800)] = (((acc0[50]-val26)*val28*alu131)+val32);
  data0_100352[(alu128+816)] = (((acc0[51]-val27)*val29*alu132)+val33);
  data0_100352[(alu128+3584)] = (((acc0[4]-val18)*val20*alu129)+val23);
  data0_100352[(alu128+3600)] = (((acc0[5]-val19)*val21*alu130)+val25);
  data0_100352[(alu128+3616)] = (((acc0[6]-val26)*val28*alu131)+val32);
  data0_100352[(alu128+3632)] = (((acc0[7]-val27)*val29*alu132)+val33);
  data0_100352[(alu128+3712)] = (((acc0[12]-val18)*val20*alu129)+val23);
  data0_100352[(alu128+3728)] = (((acc0[13]-val19)*val21*alu130)+val25);
  data0_100352[(alu128+3744)] = (((acc0[14]-val26)*val28*alu131)+val32);
  data0_100352[(alu128+3760)] = (((acc0[15]-val27)*val29*alu132)+val33);
  data0_100352[(alu128+3840)] = (((acc0[20]-val18)*val20*alu129)+val23);
  data0_100352[(alu128+3856)] = (((acc0[21]-val19)*val21*alu130)+val25);
  data0_100352[(alu128+3872)] = (((acc0[22]-val26)*val28*alu131)+val32);
  data0_100352[(alu128+3888)] = (((acc0[23]-val27)*val29*alu132)+val33);
  data0_100352[(alu128+3968)] = (((acc0[28]-val18)*val20*alu129)+val23);
  data0_100352[(alu128+3984)] = (((acc0[29]-val19)*val21*alu130)+val25);
  data0_100352[(alu128+4000)] = (((acc0[30]-val26)*val28*alu131)+val32);
  data0_100352[(alu128+4016)] = (((acc0[31]-val27)*val29*alu132)+val33);
  data0_100352[(alu128+4096)] = (((acc0[36]-val18)*val20*alu129)+val23);
  data0_100352[(alu128+4112)] = (((acc0[37]-val19)*val21*alu130)+val25);
  data0_100352[(alu128+4128)] = (((acc0[38]-val26)*val28*alu131)+val32);
  data0_100352[(alu128+4144)] = (((acc0[39]-val27)*val29*alu132)+val33);
  data0_100352[(alu128+4224)] = (((acc0[44]-val18)*val20*alu129)+val23);
  data0_100352[(alu128+4240)] = (((acc0[45]-val19)*val21*alu130)+val25);
  data0_100352[(alu128+4256)] = (((acc0[46]-val26)*val28*alu131)+val32);
  data0_100352[(alu128+4272)] = (((acc0[47]-val27)*val29*alu132)+val33);
  data0_100352[(alu128+4352)] = (((acc0[52]-val18)*val20*alu129)+val23);
  data0_100352[(alu128+4368)] = (((acc0[53]-val19)*val21*alu130)+val25);
  data0_100352[(alu128+4384)] = (((acc0[54]-val26)*val28*alu131)+val32);
  data0_100352[(alu128+4400)] = (((acc0[55]-val27)*val29*alu132)+val33);
}`;

const E_128_196_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_100352:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_100352:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_100352:array<f32>;
@compute @workgroup_size(4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 196 */
  var gidx1 = i32(gindex.y); /* 128 */
  var lidx0 = i32(lindex.x); /* 4 */
  var cast0 = bitcast<u32>(gidx0);
  var alu0 = (gidx1+bitcast<i32>((cast0<<9u))+bitcast<i32>((bitcast<u32>(lidx0)<<7u)));
  var val0 = data1_100352[alu0];
  var val1 = data2_100352[alu0];
  data0_100352[(lidx0+bitcast<i32>((cast0<<2u))+(gidx1*784))] = (val0+val1);
}`;

const E_128_49_16 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_100352:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_100352:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_128:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_128:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_128:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_128:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 49 */
  var gidx1 = i32(gindex.y); /* 128 */
  var lidx0 = i32(lindex.x); /* 16 */
  var alu0 = (lidx0+bitcast<i32>((bitcast<u32>(gidx0)<<4u))+(gidx1*784));
  var val0 = data1_100352[alu0];
  var val1 = data2_128[gidx1];
  var val2 = data3_128[gidx1];
  var val3 = data4_128[gidx1];
  var val4 = data5_128[gidx1];
  data0_100352[alu0] = (((val0-val1)*val2*(1/sqrt((val3+1e-05f))))+val4);
}`;

const r_4_4_28_32_7_128_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_100352:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_100352:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_147456:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_128:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_128:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_128:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_128:array<f32>;
@group(0) @binding(8)var<storage,read_write>data7_128:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,7>;
  var gidx0 = i32(gindex.x); /* 28 */
  var gidx1 = i32(gindex.y); /* 4 */
  var gidx2 = i32(gindex.z); /* 4 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx1*196);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 128; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu8 = (gidx0+Ridx2);
        var alu9 = (alu8+alu0+(Ridx1*28)+(Ridx0*784));
        var alu10 = ((0<alu8)&(alu8<29));
        var val0 = select(0.0f, data1_100352[(alu9+-29)], (alu10&(0<(gidx1+Ridx1))));
        var val1 = data2_147456[((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx2*36864)+(lidx0*1152))];
        var val2 = select(0.0f, data1_100352[(alu9+-1)], alu10);
        var val3 = select(0.0f, data1_100352[(alu9+27)], alu10);
        var val4 = select(0.0f, data1_100352[(alu9+55)], alu10);
        var val5 = select(0.0f, data1_100352[(alu9+83)], alu10);
        var val6 = select(0.0f, data1_100352[(alu9+111)], alu10);
        var val7 = select(0.0f, data1_100352[(alu9+139)], (alu10&(((gidx1*7)+Ridx1)<23)));
        acc0[0] = (acc0[0]+(val0*val1));
        acc0[1] = (acc0[1]+(val2*val1));
        acc0[2] = (acc0[2]+(val3*val1));
        acc0[3] = (acc0[3]+(val4*val1));
        acc0[4] = (acc0[4]+(val5*val1));
        acc0[5] = (acc0[5]+(val6*val1));
        acc0[6] = (acc0[6]+(val7*val1));
      }
    }
  }
  var alu21 = (lidx0+bitcast<i32>((bitcast<u32>(gidx2)<<5u)));
  var val8 = data3_128[alu21];
  var val9 = data4_128[alu21];
  var val10 = data5_128[alu21];
  var val11 = data6_128[alu21];
  var val12 = data7_128[alu21];
  var alu22 = (gidx0+alu0+(gidx2*25088)+(lidx0*784));
  var alu23 = (1/sqrt((val10+1e-05f)));
  var alu24 = (((acc0[0]-val8)*val9*alu23)+val11);
  var alu25 = (((acc0[1]-val8)*val9*alu23)+val11);
  var alu26 = (((acc0[2]-val8)*val9*alu23)+val11);
  var alu27 = (((acc0[3]-val8)*val9*alu23)+val11);
  var alu28 = (((acc0[4]-val8)*val9*alu23)+val11);
  var alu29 = (((acc0[5]-val8)*val9*alu23)+val11);
  var alu30 = (((acc0[6]-val8)*val9*alu23)+val11);
  var alu31 = select((val12*alu24),alu24,(0.0f<alu24));
  var alu32 = select((val12*alu25),alu25,(0.0f<alu25));
  var alu33 = select((val12*alu26),alu26,(0.0f<alu26));
  var alu34 = select((val12*alu27),alu27,(0.0f<alu27));
  var alu35 = select((val12*alu28),alu28,(0.0f<alu28));
  var alu36 = select((val12*alu29),alu29,(0.0f<alu29));
  var alu37 = select((val12*alu30),alu30,(0.0f<alu30));
  data0_100352[alu22] = alu31;
  data0_100352[(alu22+28)] = alu32;
  data0_100352[(alu22+56)] = alu33;
  data0_100352[(alu22+84)] = alu34;
  data0_100352[(alu22+112)] = alu35;
  data0_100352[(alu22+140)] = alu36;
  data0_100352[(alu22+168)] = alu37;
}`;

const r_4_4_28_32_7_128_3_3n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_100352:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_100352:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_147456:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_128:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_128:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_128:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_128:array<f32>;
@group(0) @binding(8)var<storage,read_write>data7_100352:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,7>;
  var gidx0 = i32(gindex.x); /* 28 */
  var gidx1 = i32(gindex.y); /* 4 */
  var gidx2 = i32(gindex.z); /* 4 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx1*196);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 128; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu8 = (gidx0+Ridx2);
        var alu9 = (alu8+alu0+(Ridx1*28)+(Ridx0*784));
        var alu10 = ((0<alu8)&(alu8<29));
        var val0 = select(0.0f, data1_100352[(alu9+-29)], (alu10&(0<(gidx1+Ridx1))));
        var val1 = data2_147456[((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx2*36864)+(lidx0*1152))];
        var val2 = select(0.0f, data1_100352[(alu9+-1)], alu10);
        var val3 = select(0.0f, data1_100352[(alu9+27)], alu10);
        var val4 = select(0.0f, data1_100352[(alu9+55)], alu10);
        var val5 = select(0.0f, data1_100352[(alu9+83)], alu10);
        var val6 = select(0.0f, data1_100352[(alu9+111)], alu10);
        var val7 = select(0.0f, data1_100352[(alu9+139)], (alu10&(((gidx1*7)+Ridx1)<23)));
        acc0[0] = (acc0[0]+(val0*val1));
        acc0[1] = (acc0[1]+(val2*val1));
        acc0[2] = (acc0[2]+(val3*val1));
        acc0[3] = (acc0[3]+(val4*val1));
        acc0[4] = (acc0[4]+(val5*val1));
        acc0[5] = (acc0[5]+(val6*val1));
        acc0[6] = (acc0[6]+(val7*val1));
      }
    }
  }
  var alu21 = (lidx0+bitcast<i32>((bitcast<u32>(gidx2)<<5u)));
  var val8 = data3_128[alu21];
  var val9 = data4_128[alu21];
  var val10 = data5_128[alu21];
  var val11 = data6_128[alu21];
  var alu22 = (gidx0+alu0+(gidx2*25088)+(lidx0*784));
  var val12 = data7_100352[alu22];
  var alu23 = (alu22+28);
  var val13 = data7_100352[alu23];
  var alu24 = (alu22+56);
  var val14 = data7_100352[alu24];
  var alu25 = (alu22+84);
  var val15 = data7_100352[alu25];
  var alu26 = (alu22+112);
  var val16 = data7_100352[alu26];
  var alu27 = (alu22+140);
  var val17 = data7_100352[alu27];
  var alu28 = (alu22+168);
  var val18 = data7_100352[alu28];
  var alu29 = (1/sqrt((val10+1e-05f)));
  data0_100352[alu22] = (((acc0[0]-val8)*val9*alu29)+val11+val12);
  data0_100352[alu23] = (((acc0[1]-val8)*val9*alu29)+val11+val13);
  data0_100352[alu24] = (((acc0[2]-val8)*val9*alu29)+val11+val14);
  data0_100352[alu25] = (((acc0[3]-val8)*val9*alu29)+val11+val15);
  data0_100352[alu26] = (((acc0[4]-val8)*val9*alu29)+val11+val16);
  data0_100352[alu27] = (((acc0[5]-val8)*val9*alu29)+val11+val17);
  data0_100352[alu28] = (((acc0[6]-val8)*val9*alu29)+val11+val18);
}`;

const r_14_16_16_14_128 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_50176:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_100352:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_32768:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_256:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_256:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_256:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_256:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,14>;
  var gidx0 = i32(gindex.x); /* 16 */
  var gidx1 = i32(gindex.y); /* 14 */
  var lidx0 = i32(lindex.x); /* 16 */
  var cast0 = bitcast<u32>(gidx0);
  var cast1 = bitcast<u32>(gidx1);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  acc0[7] = 0.0f;
  acc0[8] = 0.0f;
  acc0[9] = 0.0f;
  acc0[10] = 0.0f;
  acc0[11] = 0.0f;
  acc0[12] = 0.0f;
  acc0[13] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 128; Ridx0++) {
    var alu14 = (bitcast<i32>((cast1<<1u))+(Ridx0*784));
    var val0 = data1_100352[alu14];
    var val1 = data2_32768[(bitcast<i32>((cast0<<11u))+bitcast<i32>((bitcast<u32>(lidx0)<<7u))+Ridx0)];
    var val2 = data1_100352[(alu14+56)];
    var val3 = data1_100352[(alu14+112)];
    var val4 = data1_100352[(alu14+168)];
    var val5 = data1_100352[(alu14+224)];
    var val6 = data1_100352[(alu14+280)];
    var val7 = data1_100352[(alu14+336)];
    var val8 = data1_100352[(alu14+392)];
    var val9 = data1_100352[(alu14+448)];
    var val10 = data1_100352[(alu14+504)];
    var val11 = data1_100352[(alu14+560)];
    var val12 = data1_100352[(alu14+616)];
    var val13 = data1_100352[(alu14+672)];
    var val14 = data1_100352[(alu14+728)];
    acc0[0] = (acc0[0]+(val0*val1));
    acc0[1] = (acc0[1]+(val2*val1));
    acc0[2] = (acc0[2]+(val3*val1));
    acc0[3] = (acc0[3]+(val4*val1));
    acc0[4] = (acc0[4]+(val5*val1));
    acc0[5] = (acc0[5]+(val6*val1));
    acc0[6] = (acc0[6]+(val7*val1));
    acc0[7] = (acc0[7]+(val8*val1));
    acc0[8] = (acc0[8]+(val9*val1));
    acc0[9] = (acc0[9]+(val10*val1));
    acc0[10] = (acc0[10]+(val11*val1));
    acc0[11] = (acc0[11]+(val12*val1));
    acc0[12] = (acc0[12]+(val13*val1));
    acc0[13] = (acc0[13]+(val14*val1));
  }
  var alu30 = (lidx0+bitcast<i32>((cast0<<4u)));
  var val15 = data3_256[alu30];
  var val16 = data4_256[alu30];
  var val17 = data5_256[alu30];
  var val18 = data6_256[alu30];
  var alu31 = (alu30+bitcast<i32>((cast1<<8u)));
  var alu32 = (1/sqrt((val17+1e-05f)));
  data0_50176[alu31] = (((acc0[0]-val15)*val16*alu32)+val18);
  data0_50176[(alu31+3584)] = (((acc0[1]-val15)*val16*alu32)+val18);
  data0_50176[(alu31+7168)] = (((acc0[2]-val15)*val16*alu32)+val18);
  data0_50176[(alu31+10752)] = (((acc0[3]-val15)*val16*alu32)+val18);
  data0_50176[(alu31+14336)] = (((acc0[4]-val15)*val16*alu32)+val18);
  data0_50176[(alu31+17920)] = (((acc0[5]-val15)*val16*alu32)+val18);
  data0_50176[(alu31+21504)] = (((acc0[6]-val15)*val16*alu32)+val18);
  data0_50176[(alu31+25088)] = (((acc0[7]-val15)*val16*alu32)+val18);
  data0_50176[(alu31+28672)] = (((acc0[8]-val15)*val16*alu32)+val18);
  data0_50176[(alu31+32256)] = (((acc0[9]-val15)*val16*alu32)+val18);
  data0_50176[(alu31+35840)] = (((acc0[10]-val15)*val16*alu32)+val18);
  data0_50176[(alu31+39424)] = (((acc0[11]-val15)*val16*alu32)+val18);
  data0_50176[(alu31+43008)] = (((acc0[12]-val15)*val16*alu32)+val18);
  data0_50176[(alu31+46592)] = (((acc0[13]-val15)*val16*alu32)+val18);
}`;

const r_4_28_32_7_8_128_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_200704:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_100352:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_294912:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_256:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_256:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_256:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_256:array<f32>;
@group(0) @binding(8)var<storage,read_write>data7_256:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,56>;
  var gidx0 = i32(gindex.x); /* 28 */
  var gidx1 = i32(gindex.y); /* 4 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx1*196);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  acc0[7] = 0.0f;
  acc0[8] = 0.0f;
  acc0[9] = 0.0f;
  acc0[10] = 0.0f;
  acc0[11] = 0.0f;
  acc0[12] = 0.0f;
  acc0[13] = 0.0f;
  acc0[14] = 0.0f;
  acc0[15] = 0.0f;
  acc0[16] = 0.0f;
  acc0[17] = 0.0f;
  acc0[18] = 0.0f;
  acc0[19] = 0.0f;
  acc0[20] = 0.0f;
  acc0[21] = 0.0f;
  acc0[22] = 0.0f;
  acc0[23] = 0.0f;
  acc0[24] = 0.0f;
  acc0[25] = 0.0f;
  acc0[26] = 0.0f;
  acc0[27] = 0.0f;
  acc0[28] = 0.0f;
  acc0[29] = 0.0f;
  acc0[30] = 0.0f;
  acc0[31] = 0.0f;
  acc0[32] = 0.0f;
  acc0[33] = 0.0f;
  acc0[34] = 0.0f;
  acc0[35] = 0.0f;
  acc0[36] = 0.0f;
  acc0[37] = 0.0f;
  acc0[38] = 0.0f;
  acc0[39] = 0.0f;
  acc0[40] = 0.0f;
  acc0[41] = 0.0f;
  acc0[42] = 0.0f;
  acc0[43] = 0.0f;
  acc0[44] = 0.0f;
  acc0[45] = 0.0f;
  acc0[46] = 0.0f;
  acc0[47] = 0.0f;
  acc0[48] = 0.0f;
  acc0[49] = 0.0f;
  acc0[50] = 0.0f;
  acc0[51] = 0.0f;
  acc0[52] = 0.0f;
  acc0[53] = 0.0f;
  acc0[54] = 0.0f;
  acc0[55] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 128; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu57 = (gidx0+Ridx2);
        var alu58 = (alu57+alu0+(Ridx1*28)+(Ridx0*784));
        var alu59 = ((0<alu57)&(alu57<29));
        var val0 = select(0.0f, data1_100352[(alu58+-29)], (alu59&(0<(gidx1+Ridx1))));
        var alu60 = ((Ridx1*3)+Ridx2+(Ridx0*9)+(lidx0*1152));
        var val1 = data2_294912[(alu60+36864)];
        var val2 = data2_294912[alu60];
        var val3 = data2_294912[(alu60+73728)];
        var val4 = data2_294912[(alu60+110592)];
        var val5 = data2_294912[(alu60+147456)];
        var val6 = data2_294912[(alu60+184320)];
        var val7 = data2_294912[(alu60+221184)];
        var val8 = data2_294912[(alu60+258048)];
        var val9 = select(0.0f, data1_100352[(alu58+-1)], alu59);
        var val10 = select(0.0f, data1_100352[(alu58+27)], alu59);
        var val11 = select(0.0f, data1_100352[(alu58+55)], alu59);
        var val12 = select(0.0f, data1_100352[(alu58+83)], alu59);
        var val13 = select(0.0f, data1_100352[(alu58+111)], alu59);
        var val14 = select(0.0f, data1_100352[(alu58+139)], (alu59&(((gidx1*7)+Ridx1)<23)));
        acc0[0] = (acc0[0]+(val0*val2));
        acc0[1] = (acc0[1]+(val0*val1));
        acc0[2] = (acc0[2]+(val0*val3));
        acc0[3] = (acc0[3]+(val0*val4));
        acc0[4] = (acc0[4]+(val0*val5));
        acc0[5] = (acc0[5]+(val0*val6));
        acc0[6] = (acc0[6]+(val0*val7));
        acc0[7] = (acc0[7]+(val0*val8));
        acc0[8] = (acc0[8]+(val9*val2));
        acc0[9] = (acc0[9]+(val9*val1));
        acc0[10] = (acc0[10]+(val9*val3));
        acc0[11] = (acc0[11]+(val9*val4));
        acc0[12] = (acc0[12]+(val9*val5));
        acc0[13] = (acc0[13]+(val9*val6));
        acc0[14] = (acc0[14]+(val9*val7));
        acc0[15] = (acc0[15]+(val9*val8));
        acc0[16] = (acc0[16]+(val10*val2));
        acc0[17] = (acc0[17]+(val10*val1));
        acc0[18] = (acc0[18]+(val10*val3));
        acc0[19] = (acc0[19]+(val10*val4));
        acc0[20] = (acc0[20]+(val10*val5));
        acc0[21] = (acc0[21]+(val10*val6));
        acc0[22] = (acc0[22]+(val10*val7));
        acc0[23] = (acc0[23]+(val10*val8));
        acc0[24] = (acc0[24]+(val11*val2));
        acc0[25] = (acc0[25]+(val11*val1));
        acc0[26] = (acc0[26]+(val11*val3));
        acc0[27] = (acc0[27]+(val11*val4));
        acc0[28] = (acc0[28]+(val11*val5));
        acc0[29] = (acc0[29]+(val11*val6));
        acc0[30] = (acc0[30]+(val11*val7));
        acc0[31] = (acc0[31]+(val11*val8));
        acc0[32] = (acc0[32]+(val12*val2));
        acc0[33] = (acc0[33]+(val12*val1));
        acc0[34] = (acc0[34]+(val12*val3));
        acc0[35] = (acc0[35]+(val12*val4));
        acc0[36] = (acc0[36]+(val12*val5));
        acc0[37] = (acc0[37]+(val12*val6));
        acc0[38] = (acc0[38]+(val12*val7));
        acc0[39] = (acc0[39]+(val12*val8));
        acc0[40] = (acc0[40]+(val13*val2));
        acc0[41] = (acc0[41]+(val13*val1));
        acc0[42] = (acc0[42]+(val13*val3));
        acc0[43] = (acc0[43]+(val13*val4));
        acc0[44] = (acc0[44]+(val13*val5));
        acc0[45] = (acc0[45]+(val13*val6));
        acc0[46] = (acc0[46]+(val13*val7));
        acc0[47] = (acc0[47]+(val13*val8));
        acc0[48] = (acc0[48]+(val14*val2));
        acc0[49] = (acc0[49]+(val14*val1));
        acc0[50] = (acc0[50]+(val14*val3));
        acc0[51] = (acc0[51]+(val14*val4));
        acc0[52] = (acc0[52]+(val14*val5));
        acc0[53] = (acc0[53]+(val14*val6));
        acc0[54] = (acc0[54]+(val14*val7));
        acc0[55] = (acc0[55]+(val14*val8));
      }
    }
  }
  var val15 = data3_256[lidx0];
  var val16 = data4_256[lidx0];
  var val17 = data5_256[lidx0];
  var val18 = data6_256[lidx0];
  var val19 = data7_256[lidx0];
  var alu120 = (lidx0+32);
  var val20 = data3_256[alu120];
  var val21 = data4_256[alu120];
  var val22 = data5_256[alu120];
  var val23 = data6_256[alu120];
  var val24 = data7_256[alu120];
  var alu121 = (lidx0+64);
  var val25 = data3_256[alu121];
  var alu122 = (lidx0+96);
  var val26 = data3_256[alu122];
  var val27 = data4_256[alu121];
  var val28 = data4_256[alu122];
  var val29 = data5_256[alu121];
  var val30 = data5_256[alu122];
  var val31 = data6_256[alu121];
  var val32 = data6_256[alu122];
  var val33 = data7_256[alu121];
  var val34 = data7_256[alu122];
  var alu123 = (lidx0+128);
  var val35 = data3_256[alu123];
  var alu124 = (lidx0+160);
  var val36 = data3_256[alu124];
  var val37 = data4_256[alu124];
  var val38 = data5_256[alu124];
  var val39 = data6_256[alu124];
  var val40 = data7_256[alu124];
  var alu125 = (lidx0+192);
  var val41 = data3_256[alu125];
  var val42 = data4_256[alu123];
  var val43 = data4_256[alu125];
  var val44 = data5_256[alu123];
  var val45 = data5_256[alu125];
  var val46 = data6_256[alu123];
  var val47 = data6_256[alu125];
  var val48 = data7_256[alu123];
  var val49 = data7_256[alu125];
  var alu126 = (lidx0+224);
  var val50 = data3_256[alu126];
  var val51 = data4_256[alu126];
  var val52 = data5_256[alu126];
  var val53 = data6_256[alu126];
  var val54 = data7_256[alu126];
  var alu127 = (gidx0+alu0+(lidx0*784));
  var alu128 = (1/sqrt((val17+1e-05f)));
  var alu129 = (1/sqrt((val22+1e-05f)));
  var alu130 = (1/sqrt((val29+1e-05f)));
  var alu131 = (1/sqrt((val30+1e-05f)));
  var alu132 = (1/sqrt((val44+1e-05f)));
  var alu133 = (1/sqrt((val38+1e-05f)));
  var alu134 = (1/sqrt((val45+1e-05f)));
  var alu135 = (1/sqrt((val52+1e-05f)));
  var alu136 = (((acc0[0]-val15)*val16*alu128)+val18);
  var alu137 = (((acc0[1]-val20)*val21*alu129)+val23);
  var alu138 = (((acc0[2]-val25)*val27*alu130)+val31);
  var alu139 = (((acc0[3]-val26)*val28*alu131)+val32);
  var alu140 = (((acc0[4]-val35)*val42*alu132)+val46);
  var alu141 = (((acc0[5]-val36)*val37*alu133)+val39);
  var alu142 = (((acc0[6]-val41)*val43*alu134)+val47);
  var alu143 = (((acc0[7]-val50)*val51*alu135)+val53);
  var alu144 = (((acc0[8]-val15)*val16*alu128)+val18);
  var alu145 = (((acc0[9]-val20)*val21*alu129)+val23);
  var alu146 = (((acc0[10]-val25)*val27*alu130)+val31);
  var alu147 = (((acc0[11]-val26)*val28*alu131)+val32);
  var alu148 = (((acc0[12]-val35)*val42*alu132)+val46);
  var alu149 = (((acc0[13]-val36)*val37*alu133)+val39);
  var alu150 = (((acc0[14]-val41)*val43*alu134)+val47);
  var alu151 = (((acc0[15]-val50)*val51*alu135)+val53);
  var alu152 = (((acc0[16]-val15)*val16*alu128)+val18);
  var alu153 = (((acc0[17]-val20)*val21*alu129)+val23);
  var alu154 = (((acc0[18]-val25)*val27*alu130)+val31);
  var alu155 = (((acc0[19]-val26)*val28*alu131)+val32);
  var alu156 = (((acc0[20]-val35)*val42*alu132)+val46);
  var alu157 = (((acc0[21]-val36)*val37*alu133)+val39);
  var alu158 = (((acc0[22]-val41)*val43*alu134)+val47);
  var alu159 = (((acc0[23]-val50)*val51*alu135)+val53);
  var alu160 = (((acc0[24]-val15)*val16*alu128)+val18);
  var alu161 = (((acc0[25]-val20)*val21*alu129)+val23);
  var alu162 = (((acc0[26]-val25)*val27*alu130)+val31);
  var alu163 = (((acc0[27]-val26)*val28*alu131)+val32);
  var alu164 = (((acc0[28]-val35)*val42*alu132)+val46);
  var alu165 = (((acc0[29]-val36)*val37*alu133)+val39);
  var alu166 = (((acc0[30]-val41)*val43*alu134)+val47);
  var alu167 = (((acc0[31]-val50)*val51*alu135)+val53);
  var alu168 = (((acc0[32]-val15)*val16*alu128)+val18);
  var alu169 = (((acc0[33]-val20)*val21*alu129)+val23);
  var alu170 = (((acc0[34]-val25)*val27*alu130)+val31);
  var alu171 = (((acc0[35]-val26)*val28*alu131)+val32);
  var alu172 = (((acc0[36]-val35)*val42*alu132)+val46);
  var alu173 = (((acc0[37]-val36)*val37*alu133)+val39);
  var alu174 = (((acc0[38]-val41)*val43*alu134)+val47);
  var alu175 = (((acc0[39]-val50)*val51*alu135)+val53);
  var alu176 = (((acc0[40]-val15)*val16*alu128)+val18);
  var alu177 = (((acc0[41]-val20)*val21*alu129)+val23);
  var alu178 = (((acc0[42]-val25)*val27*alu130)+val31);
  var alu179 = (((acc0[43]-val26)*val28*alu131)+val32);
  var alu180 = (((acc0[44]-val35)*val42*alu132)+val46);
  var alu181 = (((acc0[45]-val36)*val37*alu133)+val39);
  var alu182 = (((acc0[46]-val41)*val43*alu134)+val47);
  var alu183 = (((acc0[47]-val50)*val51*alu135)+val53);
  var alu184 = (((acc0[48]-val15)*val16*alu128)+val18);
  var alu185 = (((acc0[49]-val20)*val21*alu129)+val23);
  var alu186 = (((acc0[50]-val25)*val27*alu130)+val31);
  var alu187 = (((acc0[51]-val26)*val28*alu131)+val32);
  var alu188 = (((acc0[52]-val35)*val42*alu132)+val46);
  var alu189 = (((acc0[53]-val36)*val37*alu133)+val39);
  var alu190 = (((acc0[54]-val41)*val43*alu134)+val47);
  var alu191 = (((acc0[55]-val50)*val51*alu135)+val53);
  var alu192 = select((val19*alu136),alu136,(0.0f<alu136));
  var alu193 = select((val24*alu137),alu137,(0.0f<alu137));
  var alu194 = select((val33*alu138),alu138,(0.0f<alu138));
  var alu195 = select((val34*alu139),alu139,(0.0f<alu139));
  var alu196 = select((val48*alu140),alu140,(0.0f<alu140));
  var alu197 = select((val40*alu141),alu141,(0.0f<alu141));
  var alu198 = select((val49*alu142),alu142,(0.0f<alu142));
  var alu199 = select((val54*alu143),alu143,(0.0f<alu143));
  var alu200 = select((val19*alu144),alu144,(0.0f<alu144));
  var alu201 = select((val24*alu145),alu145,(0.0f<alu145));
  var alu202 = select((val33*alu146),alu146,(0.0f<alu146));
  var alu203 = select((val34*alu147),alu147,(0.0f<alu147));
  var alu204 = select((val48*alu148),alu148,(0.0f<alu148));
  var alu205 = select((val40*alu149),alu149,(0.0f<alu149));
  var alu206 = select((val49*alu150),alu150,(0.0f<alu150));
  var alu207 = select((val54*alu151),alu151,(0.0f<alu151));
  var alu208 = select((val19*alu152),alu152,(0.0f<alu152));
  var alu209 = select((val24*alu153),alu153,(0.0f<alu153));
  var alu210 = select((val33*alu154),alu154,(0.0f<alu154));
  var alu211 = select((val34*alu155),alu155,(0.0f<alu155));
  var alu212 = select((val48*alu156),alu156,(0.0f<alu156));
  var alu213 = select((val40*alu157),alu157,(0.0f<alu157));
  var alu214 = select((val49*alu158),alu158,(0.0f<alu158));
  var alu215 = select((val54*alu159),alu159,(0.0f<alu159));
  var alu216 = select((val19*alu160),alu160,(0.0f<alu160));
  var alu217 = select((val24*alu161),alu161,(0.0f<alu161));
  var alu218 = select((val33*alu162),alu162,(0.0f<alu162));
  var alu219 = select((val34*alu163),alu163,(0.0f<alu163));
  var alu220 = select((val48*alu164),alu164,(0.0f<alu164));
  var alu221 = select((val40*alu165),alu165,(0.0f<alu165));
  var alu222 = select((val49*alu166),alu166,(0.0f<alu166));
  var alu223 = select((val54*alu167),alu167,(0.0f<alu167));
  var alu224 = select((val19*alu168),alu168,(0.0f<alu168));
  var alu225 = select((val24*alu169),alu169,(0.0f<alu169));
  var alu226 = select((val33*alu170),alu170,(0.0f<alu170));
  var alu227 = select((val34*alu171),alu171,(0.0f<alu171));
  var alu228 = select((val48*alu172),alu172,(0.0f<alu172));
  var alu229 = select((val40*alu173),alu173,(0.0f<alu173));
  var alu230 = select((val49*alu174),alu174,(0.0f<alu174));
  var alu231 = select((val54*alu175),alu175,(0.0f<alu175));
  var alu232 = select((val19*alu176),alu176,(0.0f<alu176));
  var alu233 = select((val24*alu177),alu177,(0.0f<alu177));
  var alu234 = select((val33*alu178),alu178,(0.0f<alu178));
  var alu235 = select((val34*alu179),alu179,(0.0f<alu179));
  var alu236 = select((val48*alu180),alu180,(0.0f<alu180));
  var alu237 = select((val40*alu181),alu181,(0.0f<alu181));
  var alu238 = select((val49*alu182),alu182,(0.0f<alu182));
  var alu239 = select((val54*alu183),alu183,(0.0f<alu183));
  var alu240 = select((val19*alu184),alu184,(0.0f<alu184));
  var alu241 = select((val24*alu185),alu185,(0.0f<alu185));
  var alu242 = select((val33*alu186),alu186,(0.0f<alu186));
  var alu243 = select((val34*alu187),alu187,(0.0f<alu187));
  var alu244 = select((val48*alu188),alu188,(0.0f<alu188));
  var alu245 = select((val40*alu189),alu189,(0.0f<alu189));
  var alu246 = select((val49*alu190),alu190,(0.0f<alu190));
  var alu247 = select((val54*alu191),alu191,(0.0f<alu191));
  data0_200704[alu127] = alu192;
  data0_200704[(alu127+28)] = alu200;
  data0_200704[(alu127+56)] = alu208;
  data0_200704[(alu127+84)] = alu216;
  data0_200704[(alu127+112)] = alu224;
  data0_200704[(alu127+140)] = alu232;
  data0_200704[(alu127+168)] = alu240;
  data0_200704[(alu127+25088)] = alu193;
  data0_200704[(alu127+25116)] = alu201;
  data0_200704[(alu127+25144)] = alu209;
  data0_200704[(alu127+25172)] = alu217;
  data0_200704[(alu127+25200)] = alu225;
  data0_200704[(alu127+25228)] = alu233;
  data0_200704[(alu127+25256)] = alu241;
  data0_200704[(alu127+50176)] = alu194;
  data0_200704[(alu127+50204)] = alu202;
  data0_200704[(alu127+50232)] = alu210;
  data0_200704[(alu127+50260)] = alu218;
  data0_200704[(alu127+50288)] = alu226;
  data0_200704[(alu127+50316)] = alu234;
  data0_200704[(alu127+50344)] = alu242;
  data0_200704[(alu127+75264)] = alu195;
  data0_200704[(alu127+75292)] = alu203;
  data0_200704[(alu127+75320)] = alu211;
  data0_200704[(alu127+75348)] = alu219;
  data0_200704[(alu127+75376)] = alu227;
  data0_200704[(alu127+75404)] = alu235;
  data0_200704[(alu127+75432)] = alu243;
  data0_200704[(alu127+100352)] = alu196;
  data0_200704[(alu127+100380)] = alu204;
  data0_200704[(alu127+100408)] = alu212;
  data0_200704[(alu127+100436)] = alu220;
  data0_200704[(alu127+100464)] = alu228;
  data0_200704[(alu127+100492)] = alu236;
  data0_200704[(alu127+100520)] = alu244;
  data0_200704[(alu127+125440)] = alu197;
  data0_200704[(alu127+125468)] = alu205;
  data0_200704[(alu127+125496)] = alu213;
  data0_200704[(alu127+125524)] = alu221;
  data0_200704[(alu127+125552)] = alu229;
  data0_200704[(alu127+125580)] = alu237;
  data0_200704[(alu127+125608)] = alu245;
  data0_200704[(alu127+150528)] = alu198;
  data0_200704[(alu127+150556)] = alu206;
  data0_200704[(alu127+150584)] = alu214;
  data0_200704[(alu127+150612)] = alu222;
  data0_200704[(alu127+150640)] = alu230;
  data0_200704[(alu127+150668)] = alu238;
  data0_200704[(alu127+150696)] = alu246;
  data0_200704[(alu127+175616)] = alu199;
  data0_200704[(alu127+175644)] = alu207;
  data0_200704[(alu127+175672)] = alu215;
  data0_200704[(alu127+175700)] = alu223;
  data0_200704[(alu127+175728)] = alu231;
  data0_200704[(alu127+175756)] = alu239;
  data0_200704[(alu127+175784)] = alu247;
}`;

const r_14_16_16_14_256_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_50176:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_200704:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_589824:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_256:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_256:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_256:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_256:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,14>;
  var gidx0 = i32(gindex.x); /* 16 */
  var gidx1 = i32(gindex.y); /* 14 */
  var lidx0 = i32(lindex.x); /* 16 */
  var cast0 = bitcast<u32>(gidx1);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  acc0[7] = 0.0f;
  acc0[8] = 0.0f;
  acc0[9] = 0.0f;
  acc0[10] = 0.0f;
  acc0[11] = 0.0f;
  acc0[12] = 0.0f;
  acc0[13] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 256; Ridx0++) {
    for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
      var alu14 = (bitcast<i32>((cast0<<1u))+Ridx2+(Ridx0*784));
      var alu15 = (0<(gidx1+Ridx2));
      var val0 = select(0.0f, data1_200704[(alu14+-1)], alu15);
      var alu16 = ((gidx0*36864)+(lidx0*2304)+(Ridx0*9)+Ridx2);
      var val1 = data2_589824[(alu16+3)];
      var val2 = select(0.0f, data1_200704[(alu14+27)], alu15);
      var val3 = data2_589824[(alu16+6)];
      var val4 = data2_589824[alu16];
      var val5 = select(0.0f, data1_200704[(alu14+55)], alu15);
      var val6 = select(0.0f, data1_200704[(alu14+83)], alu15);
      var val7 = select(0.0f, data1_200704[(alu14+111)], alu15);
      var val8 = select(0.0f, data1_200704[(alu14+139)], alu15);
      var val9 = select(0.0f, data1_200704[(alu14+167)], alu15);
      var val10 = select(0.0f, data1_200704[(alu14+195)], alu15);
      var val11 = select(0.0f, data1_200704[(alu14+223)], alu15);
      var val12 = select(0.0f, data1_200704[(alu14+251)], alu15);
      var val13 = select(0.0f, data1_200704[(alu14+279)], alu15);
      var val14 = select(0.0f, data1_200704[(alu14+307)], alu15);
      var val15 = select(0.0f, data1_200704[(alu14+335)], alu15);
      var val16 = select(0.0f, data1_200704[(alu14+363)], alu15);
      var val17 = select(0.0f, data1_200704[(alu14+391)], alu15);
      var val18 = select(0.0f, data1_200704[(alu14+419)], alu15);
      var val19 = select(0.0f, data1_200704[(alu14+447)], alu15);
      var val20 = select(0.0f, data1_200704[(alu14+475)], alu15);
      var val21 = select(0.0f, data1_200704[(alu14+503)], alu15);
      var val22 = select(0.0f, data1_200704[(alu14+531)], alu15);
      var val23 = select(0.0f, data1_200704[(alu14+559)], alu15);
      var val24 = select(0.0f, data1_200704[(alu14+587)], alu15);
      var val25 = select(0.0f, data1_200704[(alu14+615)], alu15);
      var val26 = select(0.0f, data1_200704[(alu14+643)], alu15);
      var val27 = select(0.0f, data1_200704[(alu14+671)], alu15);
      var val28 = select(0.0f, data1_200704[(alu14+699)], alu15);
      var val29 = select(0.0f, data1_200704[(alu14+727)], alu15);
      var val30 = select(0.0f, data1_200704[(alu14+755)], alu15);
      acc0[0] = (acc0[0]+(val0*val1)+(val2*val3));
      acc0[1] = (acc0[1]+(val2*val4)+(val5*val1)+(val6*val3));
      acc0[2] = (acc0[2]+(val6*val4)+(val7*val1)+(val8*val3));
      acc0[3] = (acc0[3]+(val8*val4)+(val9*val1)+(val10*val3));
      acc0[4] = (acc0[4]+(val10*val4)+(val11*val1)+(val12*val3));
      acc0[5] = (acc0[5]+(val12*val4)+(val13*val1)+(val14*val3));
      acc0[6] = (acc0[6]+(val14*val4)+(val15*val1)+(val16*val3));
      acc0[7] = (acc0[7]+(val16*val4)+(val17*val1)+(val18*val3));
      acc0[8] = (acc0[8]+(val18*val4)+(val19*val1)+(val20*val3));
      acc0[9] = (acc0[9]+(val20*val4)+(val21*val1)+(val22*val3));
      acc0[10] = (acc0[10]+(val22*val4)+(val23*val1)+(val24*val3));
      acc0[11] = (acc0[11]+(val24*val4)+(val25*val1)+(val26*val3));
      acc0[12] = (acc0[12]+(val26*val4)+(val27*val1)+(val28*val3));
      acc0[13] = (acc0[13]+(val28*val4)+(val29*val1)+(val30*val3));
    }
  }
  var alu33 = (lidx0+bitcast<i32>((bitcast<u32>(gidx0)<<4u)));
  var val31 = data3_256[alu33];
  var val32 = data4_256[alu33];
  var val33 = data5_256[alu33];
  var val34 = data6_256[alu33];
  var alu34 = (alu33+bitcast<i32>((cast0<<8u)));
  var alu35 = (1/sqrt((val33+1e-05f)));
  data0_50176[alu34] = (((acc0[0]-val31)*val32*alu35)+val34);
  data0_50176[(alu34+3584)] = (((acc0[1]-val31)*val32*alu35)+val34);
  data0_50176[(alu34+7168)] = (((acc0[2]-val31)*val32*alu35)+val34);
  data0_50176[(alu34+10752)] = (((acc0[3]-val31)*val32*alu35)+val34);
  data0_50176[(alu34+14336)] = (((acc0[4]-val31)*val32*alu35)+val34);
  data0_50176[(alu34+17920)] = (((acc0[5]-val31)*val32*alu35)+val34);
  data0_50176[(alu34+21504)] = (((acc0[6]-val31)*val32*alu35)+val34);
  data0_50176[(alu34+25088)] = (((acc0[7]-val31)*val32*alu35)+val34);
  data0_50176[(alu34+28672)] = (((acc0[8]-val31)*val32*alu35)+val34);
  data0_50176[(alu34+32256)] = (((acc0[9]-val31)*val32*alu35)+val34);
  data0_50176[(alu34+35840)] = (((acc0[10]-val31)*val32*alu35)+val34);
  data0_50176[(alu34+39424)] = (((acc0[11]-val31)*val32*alu35)+val34);
  data0_50176[(alu34+43008)] = (((acc0[12]-val31)*val32*alu35)+val34);
  data0_50176[(alu34+46592)] = (((acc0[13]-val31)*val32*alu35)+val34);
}`;

const E_32_196_8 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_50176:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_50176:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_50176:array<f32>;
@compute @workgroup_size(8) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 196 */
  var gidx1 = i32(gindex.y); /* 32 */
  var lidx0 = i32(lindex.x); /* 8 */
  var alu0 = (lidx0+bitcast<i32>((bitcast<u32>(gidx1)<<3u))+bitcast<i32>((bitcast<u32>(gidx0)<<8u)));
  var val0 = data1_50176[alu0];
  var val1 = data2_50176[alu0];
  data0_50176[(gidx0+(gidx1*1568)+(lidx0*196))] = (val0+val1);
}`;

const E_128_196_2 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_50176:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_50176:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_256:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_256:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_256:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_256:array<f32>;
@compute @workgroup_size(1) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 196 */
  var gidx1 = i32(gindex.y); /* 128 */
  var alu0 = (gidx0+(gidx1*392));
  var val0 = data1_50176[alu0];
  var cast0 = bitcast<i32>((bitcast<u32>(gidx1)<<1u));
  var val1 = data2_256[cast0];
  var val2 = data3_256[cast0];
  var val3 = data4_256[cast0];
  var val4 = data5_256[cast0];
  var alu1 = (alu0+196);
  var val5 = data1_50176[alu1];
  var alu2 = (cast0+1);
  var val6 = data2_256[alu2];
  var val7 = data3_256[alu2];
  var val8 = data4_256[alu2];
  var val9 = data5_256[alu2];
  data0_50176[alu0] = (((val0-val1)*val2*(1/sqrt((val3+1e-05f))))+val4);
  data0_50176[alu1] = (((val5-val6)*val7*(1/sqrt((val8+1e-05f))))+val9);
}`;

const r_8_14_32_14_256_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_50176:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_50176:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_589824:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_256:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_256:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_256:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_256:array<f32>;
@group(0) @binding(8)var<storage,read_write>data7_256:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,14>;
  var gidx0 = i32(gindex.x); /* 14 */
  var gidx1 = i32(gindex.y); /* 8 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx0*14);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  acc0[7] = 0.0f;
  acc0[8] = 0.0f;
  acc0[9] = 0.0f;
  acc0[10] = 0.0f;
  acc0[11] = 0.0f;
  acc0[12] = 0.0f;
  acc0[13] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 256; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu15 = (gidx0+Ridx1);
      var alu16 = (alu0+(Ridx1*14)+(Ridx0*196));
      var alu17 = ((0<alu15)&(alu15<15));
      var val0 = select(0.0f, data1_50176[(alu16+-14)], alu17);
      var alu18 = ((gidx1*73728)+(lidx0*2304)+(Ridx0*9)+(Ridx1*3));
      var val1 = data2_589824[(alu18+1)];
      var val2 = select(0.0f, data1_50176[(alu16+-13)], alu17);
      var val3 = data2_589824[(alu18+2)];
      var val4 = data2_589824[alu18];
      var val5 = select(0.0f, data1_50176[(alu16+-12)], alu17);
      var val6 = select(0.0f, data1_50176[(alu16+-11)], alu17);
      var val7 = select(0.0f, data1_50176[(alu16+-10)], alu17);
      var val8 = select(0.0f, data1_50176[(alu16+-9)], alu17);
      var val9 = select(0.0f, data1_50176[(alu16+-8)], alu17);
      var val10 = select(0.0f, data1_50176[(alu16+-7)], alu17);
      var val11 = select(0.0f, data1_50176[(alu16+-6)], alu17);
      var val12 = select(0.0f, data1_50176[(alu16+-5)], alu17);
      var val13 = select(0.0f, data1_50176[(alu16+-4)], alu17);
      var val14 = select(0.0f, data1_50176[(alu16+-3)], alu17);
      var val15 = select(0.0f, data1_50176[(alu16+-2)], alu17);
      var val16 = select(0.0f, data1_50176[(alu16+-1)], alu17);
      acc0[0] = (acc0[0]+(val0*val1)+(val2*val3));
      acc0[1] = (acc0[1]+(val0*val4)+(val2*val1)+(val5*val3));
      acc0[2] = (acc0[2]+(val2*val4)+(val5*val1)+(val6*val3));
      acc0[3] = (acc0[3]+(val5*val4)+(val6*val1)+(val7*val3));
      acc0[4] = (acc0[4]+(val6*val4)+(val7*val1)+(val8*val3));
      acc0[5] = (acc0[5]+(val7*val4)+(val8*val1)+(val9*val3));
      acc0[6] = (acc0[6]+(val8*val4)+(val9*val1)+(val10*val3));
      acc0[7] = (acc0[7]+(val9*val4)+(val10*val1)+(val11*val3));
      acc0[8] = (acc0[8]+(val10*val4)+(val11*val1)+(val12*val3));
      acc0[9] = (acc0[9]+(val11*val4)+(val12*val1)+(val13*val3));
      acc0[10] = (acc0[10]+(val12*val4)+(val13*val1)+(val14*val3));
      acc0[11] = (acc0[11]+(val13*val4)+(val14*val1)+(val15*val3));
      acc0[12] = (acc0[12]+(val14*val4)+(val15*val1)+(val16*val3));
      acc0[13] = (acc0[13]+(val15*val4)+(val16*val1));
    }
  }
  var alu35 = (lidx0+bitcast<i32>((bitcast<u32>(gidx1)<<5u)));
  var val17 = data3_256[alu35];
  var val18 = data4_256[alu35];
  var val19 = data5_256[alu35];
  var val20 = data6_256[alu35];
  var val21 = data7_256[alu35];
  var alu36 = ((gidx1*6272)+(lidx0*196)+alu0);
  var alu37 = (1/sqrt((val19+1e-05f)));
  var alu38 = (((acc0[0]-val17)*val18*alu37)+val20);
  var alu39 = (((acc0[1]-val17)*val18*alu37)+val20);
  var alu40 = (((acc0[2]-val17)*val18*alu37)+val20);
  var alu41 = (((acc0[3]-val17)*val18*alu37)+val20);
  var alu42 = (((acc0[4]-val17)*val18*alu37)+val20);
  var alu43 = (((acc0[5]-val17)*val18*alu37)+val20);
  var alu44 = (((acc0[6]-val17)*val18*alu37)+val20);
  var alu45 = (((acc0[7]-val17)*val18*alu37)+val20);
  var alu46 = (((acc0[8]-val17)*val18*alu37)+val20);
  var alu47 = (((acc0[9]-val17)*val18*alu37)+val20);
  var alu48 = (((acc0[10]-val17)*val18*alu37)+val20);
  var alu49 = (((acc0[11]-val17)*val18*alu37)+val20);
  var alu50 = (((acc0[12]-val17)*val18*alu37)+val20);
  var alu51 = (((acc0[13]-val17)*val18*alu37)+val20);
  var alu52 = select((val21*alu38),alu38,(0.0f<alu38));
  var alu53 = select((val21*alu39),alu39,(0.0f<alu39));
  var alu54 = select((val21*alu40),alu40,(0.0f<alu40));
  var alu55 = select((val21*alu41),alu41,(0.0f<alu41));
  var alu56 = select((val21*alu42),alu42,(0.0f<alu42));
  var alu57 = select((val21*alu43),alu43,(0.0f<alu43));
  var alu58 = select((val21*alu44),alu44,(0.0f<alu44));
  var alu59 = select((val21*alu45),alu45,(0.0f<alu45));
  var alu60 = select((val21*alu46),alu46,(0.0f<alu46));
  var alu61 = select((val21*alu47),alu47,(0.0f<alu47));
  var alu62 = select((val21*alu48),alu48,(0.0f<alu48));
  var alu63 = select((val21*alu49),alu49,(0.0f<alu49));
  var alu64 = select((val21*alu50),alu50,(0.0f<alu50));
  var alu65 = select((val21*alu51),alu51,(0.0f<alu51));
  data0_50176[(alu36+1)] = alu53;
  data0_50176[(alu36+2)] = alu54;
  data0_50176[(alu36+3)] = alu55;
  data0_50176[(alu36+4)] = alu56;
  data0_50176[(alu36+5)] = alu57;
  data0_50176[(alu36+6)] = alu58;
  data0_50176[(alu36+7)] = alu59;
  data0_50176[(alu36+8)] = alu60;
  data0_50176[(alu36+9)] = alu61;
  data0_50176[(alu36+10)] = alu62;
  data0_50176[(alu36+11)] = alu63;
  data0_50176[(alu36+12)] = alu64;
  data0_50176[(alu36+13)] = alu65;
  data0_50176[alu36] = alu52;
}`;

const r_8_14_32_14_256_3_3n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_50176:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_50176:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_589824:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_256:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_256:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_256:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_256:array<f32>;
@group(0) @binding(8)var<storage,read_write>data7_50176:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,14>;
  var gidx0 = i32(gindex.x); /* 14 */
  var gidx1 = i32(gindex.y); /* 8 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx0*14);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  acc0[7] = 0.0f;
  acc0[8] = 0.0f;
  acc0[9] = 0.0f;
  acc0[10] = 0.0f;
  acc0[11] = 0.0f;
  acc0[12] = 0.0f;
  acc0[13] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 256; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu15 = (gidx0+Ridx1);
      var alu16 = (alu0+(Ridx1*14)+(Ridx0*196));
      var alu17 = ((0<alu15)&(alu15<15));
      var val0 = select(0.0f, data1_50176[(alu16+-14)], alu17);
      var alu18 = ((gidx1*73728)+(lidx0*2304)+(Ridx0*9)+(Ridx1*3));
      var val1 = data2_589824[(alu18+1)];
      var val2 = select(0.0f, data1_50176[(alu16+-13)], alu17);
      var val3 = data2_589824[(alu18+2)];
      var val4 = data2_589824[alu18];
      var val5 = select(0.0f, data1_50176[(alu16+-12)], alu17);
      var val6 = select(0.0f, data1_50176[(alu16+-11)], alu17);
      var val7 = select(0.0f, data1_50176[(alu16+-10)], alu17);
      var val8 = select(0.0f, data1_50176[(alu16+-9)], alu17);
      var val9 = select(0.0f, data1_50176[(alu16+-8)], alu17);
      var val10 = select(0.0f, data1_50176[(alu16+-7)], alu17);
      var val11 = select(0.0f, data1_50176[(alu16+-6)], alu17);
      var val12 = select(0.0f, data1_50176[(alu16+-5)], alu17);
      var val13 = select(0.0f, data1_50176[(alu16+-4)], alu17);
      var val14 = select(0.0f, data1_50176[(alu16+-3)], alu17);
      var val15 = select(0.0f, data1_50176[(alu16+-2)], alu17);
      var val16 = select(0.0f, data1_50176[(alu16+-1)], alu17);
      acc0[0] = (acc0[0]+(val0*val1)+(val2*val3));
      acc0[1] = (acc0[1]+(val0*val4)+(val2*val1)+(val5*val3));
      acc0[2] = (acc0[2]+(val2*val4)+(val5*val1)+(val6*val3));
      acc0[3] = (acc0[3]+(val5*val4)+(val6*val1)+(val7*val3));
      acc0[4] = (acc0[4]+(val6*val4)+(val7*val1)+(val8*val3));
      acc0[5] = (acc0[5]+(val7*val4)+(val8*val1)+(val9*val3));
      acc0[6] = (acc0[6]+(val8*val4)+(val9*val1)+(val10*val3));
      acc0[7] = (acc0[7]+(val9*val4)+(val10*val1)+(val11*val3));
      acc0[8] = (acc0[8]+(val10*val4)+(val11*val1)+(val12*val3));
      acc0[9] = (acc0[9]+(val11*val4)+(val12*val1)+(val13*val3));
      acc0[10] = (acc0[10]+(val12*val4)+(val13*val1)+(val14*val3));
      acc0[11] = (acc0[11]+(val13*val4)+(val14*val1)+(val15*val3));
      acc0[12] = (acc0[12]+(val14*val4)+(val15*val1)+(val16*val3));
      acc0[13] = (acc0[13]+(val15*val4)+(val16*val1));
    }
  }
  var alu35 = (lidx0+bitcast<i32>((bitcast<u32>(gidx1)<<5u)));
  var val17 = data3_256[alu35];
  var val18 = data4_256[alu35];
  var val19 = data5_256[alu35];
  var val20 = data6_256[alu35];
  var alu36 = ((gidx1*6272)+(lidx0*196)+alu0);
  var alu37 = (alu36+2);
  var val21 = data7_50176[alu37];
  var alu38 = (alu36+3);
  var val22 = data7_50176[alu38];
  var val23 = data7_50176[alu36];
  var alu39 = (alu36+1);
  var val24 = data7_50176[alu39];
  var alu40 = (alu36+4);
  var val25 = data7_50176[alu40];
  var alu41 = (alu36+5);
  var val26 = data7_50176[alu41];
  var alu42 = (alu36+6);
  var val27 = data7_50176[alu42];
  var alu43 = (alu36+7);
  var val28 = data7_50176[alu43];
  var alu44 = (alu36+8);
  var val29 = data7_50176[alu44];
  var alu45 = (alu36+9);
  var val30 = data7_50176[alu45];
  var alu46 = (alu36+10);
  var val31 = data7_50176[alu46];
  var alu47 = (alu36+11);
  var val32 = data7_50176[alu47];
  var alu48 = (alu36+12);
  var val33 = data7_50176[alu48];
  var alu49 = (alu36+13);
  var val34 = data7_50176[alu49];
  var alu50 = (1/sqrt((val19+1e-05f)));
  data0_50176[alu39] = (((acc0[1]-val17)*val18*alu50)+val20+val24);
  data0_50176[alu37] = (((acc0[2]-val17)*val18*alu50)+val20+val21);
  data0_50176[alu38] = (((acc0[3]-val17)*val18*alu50)+val20+val22);
  data0_50176[alu40] = (((acc0[4]-val17)*val18*alu50)+val20+val25);
  data0_50176[alu41] = (((acc0[5]-val17)*val18*alu50)+val20+val26);
  data0_50176[alu42] = (((acc0[6]-val17)*val18*alu50)+val20+val27);
  data0_50176[alu43] = (((acc0[7]-val17)*val18*alu50)+val20+val28);
  data0_50176[alu44] = (((acc0[8]-val17)*val18*alu50)+val20+val29);
  data0_50176[alu45] = (((acc0[9]-val17)*val18*alu50)+val20+val30);
  data0_50176[alu46] = (((acc0[10]-val17)*val18*alu50)+val20+val31);
  data0_50176[alu47] = (((acc0[11]-val17)*val18*alu50)+val20+val32);
  data0_50176[alu48] = (((acc0[12]-val17)*val18*alu50)+val20+val33);
  data0_50176[alu49] = (((acc0[13]-val17)*val18*alu50)+val20+val34);
  data0_50176[alu36] = (((acc0[0]-val17)*val18*alu50)+val20+val23);
}`;

const r_7_32_16_7_256 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_25088:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_50176:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_131072:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_512:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_512:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_512:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_512:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,7>;
  var gidx0 = i32(gindex.x); /* 32 */
  var gidx1 = i32(gindex.y); /* 7 */
  var lidx0 = i32(lindex.x); /* 16 */
  var cast0 = bitcast<u32>(gidx0);
  var cast1 = bitcast<u32>(gidx1);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 256; Ridx0++) {
    var alu7 = (bitcast<i32>((cast1<<1u))+(Ridx0*196));
    var val0 = data1_50176[alu7];
    var val1 = data2_131072[(bitcast<i32>((cast0<<12u))+bitcast<i32>((bitcast<u32>(lidx0)<<8u))+Ridx0)];
    var val2 = data1_50176[(alu7+28)];
    var val3 = data1_50176[(alu7+56)];
    var val4 = data1_50176[(alu7+84)];
    var val5 = data1_50176[(alu7+112)];
    var val6 = data1_50176[(alu7+140)];
    var val7 = data1_50176[(alu7+168)];
    acc0[0] = (acc0[0]+(val0*val1));
    acc0[1] = (acc0[1]+(val2*val1));
    acc0[2] = (acc0[2]+(val3*val1));
    acc0[3] = (acc0[3]+(val4*val1));
    acc0[4] = (acc0[4]+(val5*val1));
    acc0[5] = (acc0[5]+(val6*val1));
    acc0[6] = (acc0[6]+(val7*val1));
  }
  var alu16 = (lidx0+bitcast<i32>((cast0<<4u)));
  var val8 = data3_512[alu16];
  var val9 = data4_512[alu16];
  var val10 = data5_512[alu16];
  var val11 = data6_512[alu16];
  var alu17 = (alu16+bitcast<i32>((cast1<<9u)));
  var alu18 = (1/sqrt((val10+1e-05f)));
  data0_25088[alu17] = (((acc0[0]-val8)*val9*alu18)+val11);
  data0_25088[(alu17+3584)] = (((acc0[1]-val8)*val9*alu18)+val11);
  data0_25088[(alu17+7168)] = (((acc0[2]-val8)*val9*alu18)+val11);
  data0_25088[(alu17+10752)] = (((acc0[3]-val8)*val9*alu18)+val11);
  data0_25088[(alu17+14336)] = (((acc0[4]-val8)*val9*alu18)+val11);
  data0_25088[(alu17+17920)] = (((acc0[5]-val8)*val9*alu18)+val11);
  data0_25088[(alu17+21504)] = (((acc0[6]-val8)*val9*alu18)+val11);
}`;

const r_16_14_32_14_256_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_100352:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_50176:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_1179648:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_512:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_512:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_512:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_512:array<f32>;
@group(0) @binding(8)var<storage,read_write>data7_512:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,14>;
  var gidx0 = i32(gindex.x); /* 14 */
  var gidx1 = i32(gindex.y); /* 16 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx0*14);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  acc0[7] = 0.0f;
  acc0[8] = 0.0f;
  acc0[9] = 0.0f;
  acc0[10] = 0.0f;
  acc0[11] = 0.0f;
  acc0[12] = 0.0f;
  acc0[13] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 256; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu15 = (gidx0+Ridx1);
      var alu16 = (alu0+(Ridx1*14)+(Ridx0*196));
      var alu17 = ((0<alu15)&(alu15<15));
      var val0 = select(0.0f, data1_50176[(alu16+-14)], alu17);
      var alu18 = ((gidx1*73728)+(lidx0*2304)+(Ridx0*9)+(Ridx1*3));
      var val1 = data2_1179648[(alu18+1)];
      var val2 = select(0.0f, data1_50176[(alu16+-13)], alu17);
      var val3 = data2_1179648[(alu18+2)];
      var val4 = data2_1179648[alu18];
      var val5 = select(0.0f, data1_50176[(alu16+-12)], alu17);
      var val6 = select(0.0f, data1_50176[(alu16+-11)], alu17);
      var val7 = select(0.0f, data1_50176[(alu16+-10)], alu17);
      var val8 = select(0.0f, data1_50176[(alu16+-9)], alu17);
      var val9 = select(0.0f, data1_50176[(alu16+-8)], alu17);
      var val10 = select(0.0f, data1_50176[(alu16+-7)], alu17);
      var val11 = select(0.0f, data1_50176[(alu16+-6)], alu17);
      var val12 = select(0.0f, data1_50176[(alu16+-5)], alu17);
      var val13 = select(0.0f, data1_50176[(alu16+-4)], alu17);
      var val14 = select(0.0f, data1_50176[(alu16+-3)], alu17);
      var val15 = select(0.0f, data1_50176[(alu16+-2)], alu17);
      var val16 = select(0.0f, data1_50176[(alu16+-1)], alu17);
      acc0[0] = (acc0[0]+(val0*val1)+(val2*val3));
      acc0[1] = (acc0[1]+(val0*val4)+(val2*val1)+(val5*val3));
      acc0[2] = (acc0[2]+(val2*val4)+(val5*val1)+(val6*val3));
      acc0[3] = (acc0[3]+(val5*val4)+(val6*val1)+(val7*val3));
      acc0[4] = (acc0[4]+(val6*val4)+(val7*val1)+(val8*val3));
      acc0[5] = (acc0[5]+(val7*val4)+(val8*val1)+(val9*val3));
      acc0[6] = (acc0[6]+(val8*val4)+(val9*val1)+(val10*val3));
      acc0[7] = (acc0[7]+(val9*val4)+(val10*val1)+(val11*val3));
      acc0[8] = (acc0[8]+(val10*val4)+(val11*val1)+(val12*val3));
      acc0[9] = (acc0[9]+(val11*val4)+(val12*val1)+(val13*val3));
      acc0[10] = (acc0[10]+(val12*val4)+(val13*val1)+(val14*val3));
      acc0[11] = (acc0[11]+(val13*val4)+(val14*val1)+(val15*val3));
      acc0[12] = (acc0[12]+(val14*val4)+(val15*val1)+(val16*val3));
      acc0[13] = (acc0[13]+(val15*val4)+(val16*val1));
    }
  }
  var alu35 = (lidx0+bitcast<i32>((bitcast<u32>(gidx1)<<5u)));
  var val17 = data3_512[alu35];
  var val18 = data4_512[alu35];
  var val19 = data5_512[alu35];
  var val20 = data6_512[alu35];
  var val21 = data7_512[alu35];
  var alu36 = ((gidx1*6272)+(lidx0*196)+alu0);
  var alu37 = (1/sqrt((val19+1e-05f)));
  var alu38 = (((acc0[0]-val17)*val18*alu37)+val20);
  var alu39 = (((acc0[1]-val17)*val18*alu37)+val20);
  var alu40 = (((acc0[2]-val17)*val18*alu37)+val20);
  var alu41 = (((acc0[3]-val17)*val18*alu37)+val20);
  var alu42 = (((acc0[4]-val17)*val18*alu37)+val20);
  var alu43 = (((acc0[5]-val17)*val18*alu37)+val20);
  var alu44 = (((acc0[6]-val17)*val18*alu37)+val20);
  var alu45 = (((acc0[7]-val17)*val18*alu37)+val20);
  var alu46 = (((acc0[8]-val17)*val18*alu37)+val20);
  var alu47 = (((acc0[9]-val17)*val18*alu37)+val20);
  var alu48 = (((acc0[10]-val17)*val18*alu37)+val20);
  var alu49 = (((acc0[11]-val17)*val18*alu37)+val20);
  var alu50 = (((acc0[12]-val17)*val18*alu37)+val20);
  var alu51 = (((acc0[13]-val17)*val18*alu37)+val20);
  var alu52 = select((val21*alu38),alu38,(0.0f<alu38));
  var alu53 = select((val21*alu39),alu39,(0.0f<alu39));
  var alu54 = select((val21*alu40),alu40,(0.0f<alu40));
  var alu55 = select((val21*alu41),alu41,(0.0f<alu41));
  var alu56 = select((val21*alu42),alu42,(0.0f<alu42));
  var alu57 = select((val21*alu43),alu43,(0.0f<alu43));
  var alu58 = select((val21*alu44),alu44,(0.0f<alu44));
  var alu59 = select((val21*alu45),alu45,(0.0f<alu45));
  var alu60 = select((val21*alu46),alu46,(0.0f<alu46));
  var alu61 = select((val21*alu47),alu47,(0.0f<alu47));
  var alu62 = select((val21*alu48),alu48,(0.0f<alu48));
  var alu63 = select((val21*alu49),alu49,(0.0f<alu49));
  var alu64 = select((val21*alu50),alu50,(0.0f<alu50));
  var alu65 = select((val21*alu51),alu51,(0.0f<alu51));
  data0_100352[(alu36+1)] = alu53;
  data0_100352[(alu36+2)] = alu54;
  data0_100352[(alu36+3)] = alu55;
  data0_100352[(alu36+4)] = alu56;
  data0_100352[(alu36+5)] = alu57;
  data0_100352[(alu36+6)] = alu58;
  data0_100352[(alu36+7)] = alu59;
  data0_100352[(alu36+8)] = alu60;
  data0_100352[(alu36+9)] = alu61;
  data0_100352[(alu36+10)] = alu62;
  data0_100352[(alu36+11)] = alu63;
  data0_100352[(alu36+12)] = alu64;
  data0_100352[(alu36+13)] = alu65;
  data0_100352[alu36] = alu52;
}`;

const r_7_32_16_7_512_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_25088:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_100352:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_2359296:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_512:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_512:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_512:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_512:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,7>;
  var gidx0 = i32(gindex.x); /* 32 */
  var gidx1 = i32(gindex.y); /* 7 */
  var lidx0 = i32(lindex.x); /* 16 */
  var cast0 = bitcast<u32>(gidx1);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 512; Ridx0++) {
    for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
      var alu7 = (bitcast<i32>((cast0<<1u))+Ridx2+(Ridx0*196));
      var alu8 = (0<(gidx1+Ridx2));
      var val0 = select(0.0f, data1_100352[(alu7+-1)], alu8);
      var alu9 = ((gidx0*73728)+(lidx0*4608)+(Ridx0*9)+Ridx2);
      var val1 = data2_2359296[(alu9+3)];
      var val2 = select(0.0f, data1_100352[(alu7+13)], alu8);
      var val3 = data2_2359296[(alu9+6)];
      var val4 = data2_2359296[alu9];
      var val5 = select(0.0f, data1_100352[(alu7+27)], alu8);
      var val6 = select(0.0f, data1_100352[(alu7+41)], alu8);
      var val7 = select(0.0f, data1_100352[(alu7+55)], alu8);
      var val8 = select(0.0f, data1_100352[(alu7+69)], alu8);
      var val9 = select(0.0f, data1_100352[(alu7+83)], alu8);
      var val10 = select(0.0f, data1_100352[(alu7+97)], alu8);
      var val11 = select(0.0f, data1_100352[(alu7+111)], alu8);
      var val12 = select(0.0f, data1_100352[(alu7+125)], alu8);
      var val13 = select(0.0f, data1_100352[(alu7+139)], alu8);
      var val14 = select(0.0f, data1_100352[(alu7+153)], alu8);
      var val15 = select(0.0f, data1_100352[(alu7+167)], alu8);
      var val16 = select(0.0f, data1_100352[(alu7+181)], alu8);
      acc0[0] = (acc0[0]+(val0*val1)+(val2*val3));
      acc0[1] = (acc0[1]+(val2*val4)+(val5*val1)+(val6*val3));
      acc0[2] = (acc0[2]+(val6*val4)+(val7*val1)+(val8*val3));
      acc0[3] = (acc0[3]+(val8*val4)+(val9*val1)+(val10*val3));
      acc0[4] = (acc0[4]+(val10*val4)+(val11*val1)+(val12*val3));
      acc0[5] = (acc0[5]+(val12*val4)+(val13*val1)+(val14*val3));
      acc0[6] = (acc0[6]+(val14*val4)+(val15*val1)+(val16*val3));
    }
  }
  var alu19 = (lidx0+bitcast<i32>((bitcast<u32>(gidx0)<<4u)));
  var val17 = data3_512[alu19];
  var val18 = data4_512[alu19];
  var val19 = data5_512[alu19];
  var val20 = data6_512[alu19];
  var alu20 = (alu19+bitcast<i32>((cast0<<9u)));
  var alu21 = (1/sqrt((val19+1e-05f)));
  data0_25088[alu20] = (((acc0[0]-val17)*val18*alu21)+val20);
  data0_25088[(alu20+3584)] = (((acc0[1]-val17)*val18*alu21)+val20);
  data0_25088[(alu20+7168)] = (((acc0[2]-val17)*val18*alu21)+val20);
  data0_25088[(alu20+10752)] = (((acc0[3]-val17)*val18*alu21)+val20);
  data0_25088[(alu20+14336)] = (((acc0[4]-val17)*val18*alu21)+val20);
  data0_25088[(alu20+17920)] = (((acc0[5]-val17)*val18*alu21)+val20);
  data0_25088[(alu20+21504)] = (((acc0[6]-val17)*val18*alu21)+val20);
}`;

const E_256_49_2 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_25088:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_25088:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_25088:array<f32>;
@compute @workgroup_size(1) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 49 */
  var gidx1 = i32(gindex.y); /* 256 */
  var alu0 = (bitcast<i32>((bitcast<u32>(gidx0)<<9u))+bitcast<i32>((bitcast<u32>(gidx1)<<1u)));
  var val0 = data1_25088[alu0];
  var alu1 = (alu0+1);
  var val1 = data1_25088[alu1];
  var val2 = data2_25088[alu0];
  var val3 = data2_25088[alu1];
  var alu2 = (gidx0+(gidx1*98));
  data0_25088[alu2] = (val0+val2);
  data0_25088[(alu2+49)] = (val1+val3);
}`;

const E_256_49_2n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_25088:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_25088:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_512:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_512:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_512:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_512:array<f32>;
@compute @workgroup_size(1) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 49 */
  var gidx1 = i32(gindex.y); /* 256 */
  var alu0 = (gidx0+(gidx1*98));
  var val0 = data1_25088[alu0];
  var cast0 = bitcast<i32>((bitcast<u32>(gidx1)<<1u));
  var val1 = data2_512[cast0];
  var val2 = data3_512[cast0];
  var val3 = data4_512[cast0];
  var val4 = data5_512[cast0];
  var alu1 = (alu0+49);
  var val5 = data1_25088[alu1];
  var alu2 = (cast0+1);
  var val6 = data2_512[alu2];
  var val7 = data3_512[alu2];
  var val8 = data4_512[alu2];
  var val9 = data5_512[alu2];
  data0_25088[alu0] = (((val0-val1)*val2*(1/sqrt((val3+1e-05f))))+val4);
  data0_25088[alu1] = (((val5-val6)*val7*(1/sqrt((val8+1e-05f))))+val9);
}`;

const r_16_7_32_7_512_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_25088:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_25088:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_2359296:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_512:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_512:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_512:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_512:array<f32>;
@group(0) @binding(8)var<storage,read_write>data7_512:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,7>;
  var gidx0 = i32(gindex.x); /* 7 */
  var gidx1 = i32(gindex.y); /* 16 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx0*7);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 512; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu8 = (gidx0+Ridx1);
      var alu9 = (alu0+(Ridx1*7)+(Ridx0*49));
      var alu10 = ((0<alu8)&(alu8<8));
      var val0 = select(0.0f, data1_25088[(alu9+-7)], alu10);
      var alu11 = ((gidx1*147456)+(lidx0*4608)+(Ridx0*9)+(Ridx1*3));
      var val1 = data2_2359296[(alu11+1)];
      var val2 = select(0.0f, data1_25088[(alu9+-6)], alu10);
      var val3 = data2_2359296[(alu11+2)];
      var val4 = data2_2359296[alu11];
      var val5 = select(0.0f, data1_25088[(alu9+-5)], alu10);
      var val6 = select(0.0f, data1_25088[(alu9+-4)], alu10);
      var val7 = select(0.0f, data1_25088[(alu9+-3)], alu10);
      var val8 = select(0.0f, data1_25088[(alu9+-2)], alu10);
      var val9 = select(0.0f, data1_25088[(alu9+-1)], alu10);
      acc0[0] = (acc0[0]+(val0*val1)+(val2*val3));
      acc0[1] = (acc0[1]+(val0*val4)+(val2*val1)+(val5*val3));
      acc0[2] = (acc0[2]+(val2*val4)+(val5*val1)+(val6*val3));
      acc0[3] = (acc0[3]+(val5*val4)+(val6*val1)+(val7*val3));
      acc0[4] = (acc0[4]+(val6*val4)+(val7*val1)+(val8*val3));
      acc0[5] = (acc0[5]+(val7*val4)+(val8*val1)+(val9*val3));
      acc0[6] = (acc0[6]+(val8*val4)+(val9*val1));
    }
  }
  var alu21 = (lidx0+bitcast<i32>((bitcast<u32>(gidx1)<<5u)));
  var val10 = data3_512[alu21];
  var val11 = data4_512[alu21];
  var val12 = data5_512[alu21];
  var val13 = data6_512[alu21];
  var val14 = data7_512[alu21];
  var alu22 = ((gidx1*1568)+(lidx0*49)+alu0);
  var alu23 = (1/sqrt((val12+1e-05f)));
  var alu24 = (((acc0[0]-val10)*val11*alu23)+val13);
  var alu25 = (((acc0[1]-val10)*val11*alu23)+val13);
  var alu26 = (((acc0[2]-val10)*val11*alu23)+val13);
  var alu27 = (((acc0[3]-val10)*val11*alu23)+val13);
  var alu28 = (((acc0[4]-val10)*val11*alu23)+val13);
  var alu29 = (((acc0[5]-val10)*val11*alu23)+val13);
  var alu30 = (((acc0[6]-val10)*val11*alu23)+val13);
  var alu31 = select((val14*alu24),alu24,(0.0f<alu24));
  var alu32 = select((val14*alu25),alu25,(0.0f<alu25));
  var alu33 = select((val14*alu26),alu26,(0.0f<alu26));
  var alu34 = select((val14*alu27),alu27,(0.0f<alu27));
  var alu35 = select((val14*alu28),alu28,(0.0f<alu28));
  var alu36 = select((val14*alu29),alu29,(0.0f<alu29));
  var alu37 = select((val14*alu30),alu30,(0.0f<alu30));
  data0_25088[(alu22+1)] = alu32;
  data0_25088[(alu22+2)] = alu33;
  data0_25088[(alu22+3)] = alu34;
  data0_25088[(alu22+4)] = alu35;
  data0_25088[(alu22+5)] = alu36;
  data0_25088[(alu22+6)] = alu37;
  data0_25088[alu22] = alu31;
}`;

const r_16_7_32_7_512_3_3n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_25088:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_25088:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_2359296:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_512:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_512:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_512:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_512:array<f32>;
@group(0) @binding(8)var<storage,read_write>data7_25088:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,7>;
  var gidx0 = i32(gindex.x); /* 7 */
  var gidx1 = i32(gindex.y); /* 16 */
  var lidx0 = i32(lindex.x); /* 32 */
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 512; Ridx0++) {
    for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
      var alu7 = (gidx0+Ridx2);
      var alu8 = (alu7+(Ridx0*49));
      var alu9 = ((0<alu7)&(alu7<8));
      var val0 = select(0.0f, data1_25088[(alu8+-1)], alu9);
      var alu10 = ((gidx1*147456)+(lidx0*4608)+(Ridx0*9)+Ridx2);
      var val1 = data2_2359296[(alu10+3)];
      var val2 = select(0.0f, data1_25088[(alu8+6)], alu9);
      var val3 = data2_2359296[(alu10+6)];
      var val4 = data2_2359296[alu10];
      var val5 = select(0.0f, data1_25088[(alu8+13)], alu9);
      var val6 = select(0.0f, data1_25088[(alu8+20)], alu9);
      var val7 = select(0.0f, data1_25088[(alu8+27)], alu9);
      var val8 = select(0.0f, data1_25088[(alu8+34)], alu9);
      var val9 = select(0.0f, data1_25088[(alu8+41)], alu9);
      acc0[0] = (acc0[0]+(val0*val1)+(val2*val3));
      acc0[1] = (acc0[1]+(val0*val4)+(val2*val1)+(val5*val3));
      acc0[2] = (acc0[2]+(val2*val4)+(val5*val1)+(val6*val3));
      acc0[3] = (acc0[3]+(val5*val4)+(val6*val1)+(val7*val3));
      acc0[4] = (acc0[4]+(val6*val4)+(val7*val1)+(val8*val3));
      acc0[5] = (acc0[5]+(val7*val4)+(val8*val1)+(val9*val3));
      acc0[6] = (acc0[6]+(val8*val4)+(val9*val1));
    }
  }
  var alu20 = (lidx0+bitcast<i32>((bitcast<u32>(gidx1)<<5u)));
  var val10 = data3_512[alu20];
  var val11 = data4_512[alu20];
  var val12 = data5_512[alu20];
  var val13 = data6_512[alu20];
  var alu21 = (gidx0+(gidx1*1568)+(lidx0*49));
  var val14 = data7_25088[alu21];
  var alu22 = (alu21+7);
  var val15 = data7_25088[alu22];
  var alu23 = (alu21+14);
  var val16 = data7_25088[alu23];
  var alu24 = (alu21+21);
  var val17 = data7_25088[alu24];
  var alu25 = (alu21+28);
  var val18 = data7_25088[alu25];
  var alu26 = (alu21+35);
  var val19 = data7_25088[alu26];
  var alu27 = (alu21+42);
  var val20 = data7_25088[alu27];
  var alu28 = (1/sqrt((val12+1e-05f)));
  data0_25088[alu21] = (((acc0[0]-val10)*val11*alu28)+val13+val14);
  data0_25088[alu22] = (((acc0[1]-val10)*val11*alu28)+val13+val15);
  data0_25088[alu23] = (((acc0[2]-val10)*val11*alu28)+val13+val16);
  data0_25088[alu24] = (((acc0[3]-val10)*val11*alu28)+val13+val17);
  data0_25088[alu25] = (((acc0[4]-val10)*val11*alu28)+val13+val18);
  data0_25088[alu26] = (((acc0[5]-val10)*val11*alu28)+val13+val19);
  data0_25088[alu27] = (((acc0[6]-val10)*val11*alu28)+val13+val20);
}`;

const r_7_32_16_7_512_3_3n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_25088:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_25088:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_2359296:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_512:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_512:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_512:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_512:array<f32>;
@group(0) @binding(8)var<storage,read_write>data7_25088:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,7>;
  var gidx0 = i32(gindex.x); /* 32 */
  var gidx1 = i32(gindex.y); /* 7 */
  var lidx0 = i32(lindex.x); /* 16 */
  var alu0 = (gidx1*7);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 512; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu8 = (gidx1+Ridx1);
      var alu9 = ((0<alu8)&(alu8<8));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu10 = (alu0+(Ridx1*7)+Ridx2+(Ridx0*49));
        var val0 = select(0.0f, data1_25088[(alu10+-8)], ((0<Ridx2)&alu9));
        var val1 = data2_2359296[((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx0*73728)+(lidx0*4608))];
        var val2 = select(0.0f, data1_25088[(alu10+-7)], alu9);
        var val3 = select(0.0f, data1_25088[(alu10+-6)], alu9);
        var val4 = select(0.0f, data1_25088[(alu10+-5)], alu9);
        var val5 = select(0.0f, data1_25088[(alu10+-4)], alu9);
        var val6 = select(0.0f, data1_25088[(alu10+-3)], alu9);
        var val7 = select(0.0f, data1_25088[(alu10+-2)], ((Ridx2<2)&alu9));
        acc0[0] = (acc0[0]+(val0*val1));
        acc0[1] = (acc0[1]+(val2*val1));
        acc0[2] = (acc0[2]+(val3*val1));
        acc0[3] = (acc0[3]+(val4*val1));
        acc0[4] = (acc0[4]+(val5*val1));
        acc0[5] = (acc0[5]+(val6*val1));
        acc0[6] = (acc0[6]+(val7*val1));
      }
    }
  }
  var alu21 = (lidx0+bitcast<i32>((bitcast<u32>(gidx0)<<4u)));
  var val8 = data3_512[alu21];
  var val9 = data4_512[alu21];
  var val10 = data5_512[alu21];
  var val11 = data6_512[alu21];
  var alu22 = ((gidx0*784)+(lidx0*49)+alu0);
  var val12 = data7_25088[(alu22+1)];
  var val13 = data7_25088[(alu22+2)];
  var val14 = data7_25088[alu22];
  var val15 = data7_25088[(alu22+3)];
  var val16 = data7_25088[(alu22+4)];
  var val17 = data7_25088[(alu22+5)];
  var val18 = data7_25088[(alu22+6)];
  var alu23 = (alu21+(gidx1*3584));
  var alu24 = (1/sqrt((val10+1e-05f)));
  data0_25088[alu23] = (((acc0[0]-val8)*val9*alu24)+val11+val14);
  data0_25088[(alu23+512)] = (((acc0[1]-val8)*val9*alu24)+val11+val12);
  data0_25088[(alu23+1024)] = (((acc0[2]-val8)*val9*alu24)+val11+val13);
  data0_25088[(alu23+1536)] = (((acc0[3]-val8)*val9*alu24)+val11+val15);
  data0_25088[(alu23+2048)] = (((acc0[4]-val8)*val9*alu24)+val11+val16);
  data0_25088[(alu23+2560)] = (((acc0[5]-val8)*val9*alu24)+val11+val17);
  data0_25088[(alu23+3072)] = (((acc0[6]-val8)*val9*alu24)+val11+val18);
}`;

const E_128_49_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_25088:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_25088:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_512:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_512:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_512:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_512:array<f32>;
@compute @workgroup_size(1) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 49 */
  var gidx1 = i32(gindex.y); /* 128 */
  var cast0 = bitcast<i32>((bitcast<u32>(gidx1)<<2u));
  var alu0 = (bitcast<i32>((bitcast<u32>(gidx0)<<9u))+cast0);
  var val0 = data1_25088[alu0];
  var val1 = data2_512[cast0];
  var alu1 = (cast0+1);
  var val2 = data2_512[alu1];
  var alu2 = (cast0+2);
  var val3 = data2_512[alu2];
  var val4 = data3_512[cast0];
  var val5 = data3_512[alu1];
  var val6 = data4_512[cast0];
  var val7 = data5_512[cast0];
  var val8 = data1_25088[(alu0+1)];
  var val9 = data4_512[alu1];
  var val10 = data5_512[alu1];
  var val11 = data1_25088[(alu0+2)];
  var val12 = data3_512[alu2];
  var val13 = data4_512[alu2];
  var val14 = data5_512[alu2];
  var val15 = data1_25088[(alu0+3)];
  var alu3 = (cast0+3);
  var val16 = data2_512[alu3];
  var val17 = data3_512[alu3];
  var val18 = data4_512[alu3];
  var val19 = data5_512[alu3];
  var alu4 = (gidx0+(gidx1*196));
  data0_25088[alu4] = (((val0+val1)*val4*(1/sqrt((val6+1e-05f))))+val7);
  data0_25088[(alu4+49)] = (((val8+val2)*val5*(1/sqrt((val9+1e-05f))))+val10);
  data0_25088[(alu4+98)] = (((val11+val3)*val12*(1/sqrt((val13+1e-05f))))+val14);
  data0_25088[(alu4+147)] = (((val15+val16)*val17*(1/sqrt((val18+1e-05f))))+val19);
}`;

const r_512_28_896 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
var<workgroup> temp0: array<f32,28>;
@group(0) @binding(1)var<storage,read_write>data0_512:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_25088:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_12845056:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_512:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_512:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_512:array<f32>;
@compute @workgroup_size(28) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,1>;
  var acc1: array<f32,1>;
  var gidx0 = i32(gindex.x); /* 512 */
  var lidx0 = i32(lindex.x); /* 28 */
  acc0[0] = 0.0f;
  for (var Ridx0_0 = 0; Ridx0_0 < 896; Ridx0_0++) {
    var alu1 = ((lidx0*896)+Ridx0_0);
    var val0 = data1_25088[alu1];
    var val1 = data2_12845056[(alu1+(gidx0*25088))];
    acc0[0] = (acc0[0]+(val0*val1));
  }
  temp0[lidx0] = acc0[0];
  workgroupBarrier();
  acc1[0] = 0.0f;
  for (var Ridx102 = 0; Ridx102 < 28; Ridx102++) {
    var val2 = temp0[Ridx102];
    acc1[0] = (acc1[0]+val2);
  }
  var val3 = data3_512[gidx0];
  var val4 = data4_512[gidx0];
  var val5 = data5_512[gidx0];
  var alu9 = ((bool(lidx0))!=true);
  if (alu9) {
    data0_512[gidx0] = (((acc1[0]+val3)-val4)*(1/sqrt((val5+1e-05f))));
  }
}`;

const r_128_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_1:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_512:array<f32>;
@compute @workgroup_size(1) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,1>;
  acc0[0] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 128; Ridx0++) {
    var cast0 = bitcast<i32>((bitcast<u32>(Ridx0)<<2u));
    var val0 = data1_512[cast0];
    var val1 = data1_512[(cast0+1)];
    var val2 = data1_512[(cast0+2)];
    var val3 = data1_512[(cast0+3)];
    acc0[0] = (acc0[0]+(val0*val0)+(val1*val1)+(val2*val2)+(val3*val3));
  }
  data0_1[0] = sqrt(acc0[0]);
}`;

const E_256_2n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_512:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_512:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_1:array<f32>;
@compute @workgroup_size(1) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 256 */
  var cast0 = bitcast<i32>((bitcast<u32>(gidx0)<<1u));
  var val0 = data1_512[cast0];
  var val1 = data2_1[0];
  var alu0 = (cast0+1);
  var val2 = data1_512[alu0];
  var alu1 = (1/val1);
  data0_512[cast0] = (val0*alu1);
  data0_512[alu0] = (val2*alu1);
}`;

const setupNet = async (device, safetensor) => {
    const metadata = getTensorMetadata(safetensor);
    const infinityBuf = createInfinityUniformBuf(device);

    const layouts=[device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]})]

    const buf_0 = createEmptyBuf(device, 3211264);;
    const input0 = createEmptyBuf(device, 37632);;
    const buf_1 = createWeightBuf(device, 6912, getTensorBuffer(safetensor, metadata['conv0.weight']));
    const buf_2 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['bn0.running_mean']));
    const buf_3 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['bn0.weight']));
    const buf_4 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['bn0.running_var']));
    const buf_5 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['bn0.bias']));
    const buf_6 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['prelu_weight']));
    const buf_7 = createEmptyBuf(device, 2048);;
    const buf_8 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['bn.running_mean']));
    const buf_9 = createEmptyBuf(device, 3211264);;
    const buf_10 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.0.res_layer0.running_mean']));
    const buf_11 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.0.res_layer0.weight']));
    const buf_12 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.0.res_layer0.running_var']));
    const buf_13 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.0.res_layer0.bias']));
    const buf_14 = createEmptyBuf(device, 3211264);;
    const buf_15 = createWeightBuf(device, 147456, getTensorBuffer(safetensor, metadata['body.list.0.conv_layer0.weight']));
    const buf_16 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.0.res_layer1.running_mean']));
    const buf_17 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.0.res_layer1.weight']));
    const buf_18 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.0.res_layer1.running_var']));
    const buf_19 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.0.res_layer1.bias']));
    const buf_20 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.0.prelu_weight']));
    const buf_21 = createEmptyBuf(device, 802816);;
    const buf_22 = createWeightBuf(device, 147456, getTensorBuffer(safetensor, metadata['body.list.0.conv_layer1.weight']));
    const buf_23 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.0.res_layer2.running_mean']));
    const buf_24 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.0.res_layer2.weight']));
    const buf_25 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.0.res_layer2.running_var']));
    const buf_26 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.0.res_layer2.bias']));
    const buf_27 = createEmptyBuf(device, 802816);;
    const buf_28 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.1.res_layer0.running_mean']));
    const buf_29 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.1.res_layer0.weight']));
    const buf_30 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.1.res_layer0.running_var']));
    const buf_31 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.1.res_layer0.bias']));
    const buf_32 = createEmptyBuf(device, 802816);;
    const buf_33 = createWeightBuf(device, 147456, getTensorBuffer(safetensor, metadata['body.list.1.conv_layer0.weight']));
    const buf_34 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.1.res_layer1.running_mean']));
    const buf_35 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.1.res_layer1.weight']));
    const buf_36 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.1.res_layer1.running_var']));
    const buf_37 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.1.res_layer1.bias']));
    const buf_38 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.1.prelu_weight']));
    const buf_39 = createWeightBuf(device, 147456, getTensorBuffer(safetensor, metadata['body.list.1.conv_layer1.weight']));
    const buf_40 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.1.res_layer2.running_mean']));
    const buf_41 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.1.res_layer2.weight']));
    const buf_42 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.1.res_layer2.running_var']));
    const buf_43 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.1.res_layer2.bias']));
    const buf_44 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.2.res_layer0.running_mean']));
    const buf_45 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.2.res_layer0.weight']));
    const buf_46 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.2.res_layer0.running_var']));
    const buf_47 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.2.res_layer0.bias']));
    const buf_48 = createWeightBuf(device, 147456, getTensorBuffer(safetensor, metadata['body.list.2.conv_layer0.weight']));
    const buf_49 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.2.res_layer1.running_mean']));
    const buf_50 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.2.res_layer1.weight']));
    const buf_51 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.2.res_layer1.running_var']));
    const buf_52 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.2.res_layer1.bias']));
    const buf_53 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.2.prelu_weight']));
    const buf_54 = createWeightBuf(device, 147456, getTensorBuffer(safetensor, metadata['body.list.2.conv_layer1.weight']));
    const buf_55 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.2.res_layer2.running_mean']));
    const buf_56 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.2.res_layer2.weight']));
    const buf_57 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.2.res_layer2.running_var']));
    const buf_58 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.2.res_layer2.bias']));
    const buf_59 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.3.res_layer0.running_mean']));
    const buf_60 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.3.res_layer0.weight']));
    const buf_61 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.3.res_layer0.running_var']));
    const buf_62 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['body.list.3.res_layer0.bias']));
    const buf_63 = createEmptyBuf(device, 401408);;
    const buf_64 = createWeightBuf(device, 32768, getTensorBuffer(safetensor, metadata['body.list.3.shortcut_layer0.weight']));
    const buf_65 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.3.shortcut_layer1.running_mean']));
    const buf_66 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.3.shortcut_layer1.weight']));
    const buf_67 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.3.shortcut_layer1.running_var']));
    const buf_68 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.3.shortcut_layer1.bias']));
    const buf_69 = createEmptyBuf(device, 1605632);;
    const buf_70 = createWeightBuf(device, 294912, getTensorBuffer(safetensor, metadata['body.list.3.conv_layer0.weight']));
    const buf_71 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.3.res_layer1.running_mean']));
    const buf_72 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.3.res_layer1.weight']));
    const buf_73 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.3.res_layer1.running_var']));
    const buf_74 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.3.res_layer1.bias']));
    const buf_75 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.3.prelu_weight']));
    const buf_76 = createEmptyBuf(device, 401408);;
    const buf_77 = createWeightBuf(device, 589824, getTensorBuffer(safetensor, metadata['body.list.3.conv_layer1.weight']));
    const buf_78 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.3.res_layer2.running_mean']));
    const buf_79 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.3.res_layer2.weight']));
    const buf_80 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.3.res_layer2.running_var']));
    const buf_81 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.3.res_layer2.bias']));
    const buf_82 = createEmptyBuf(device, 401408);;
    const buf_83 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.4.res_layer0.running_mean']));
    const buf_84 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.4.res_layer0.weight']));
    const buf_85 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.4.res_layer0.running_var']));
    const buf_86 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.4.res_layer0.bias']));
    const buf_87 = createWeightBuf(device, 589824, getTensorBuffer(safetensor, metadata['body.list.4.conv_layer0.weight']));
    const buf_88 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.4.res_layer1.running_mean']));
    const buf_89 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.4.res_layer1.weight']));
    const buf_90 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.4.res_layer1.running_var']));
    const buf_91 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.4.res_layer1.bias']));
    const buf_92 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.4.prelu_weight']));
    const buf_93 = createWeightBuf(device, 589824, getTensorBuffer(safetensor, metadata['body.list.4.conv_layer1.weight']));
    const buf_94 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.4.res_layer2.running_mean']));
    const buf_95 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.4.res_layer2.weight']));
    const buf_96 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.4.res_layer2.running_var']));
    const buf_97 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.4.res_layer2.bias']));
    const buf_98 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.5.res_layer0.running_mean']));
    const buf_99 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.5.res_layer0.weight']));
    const buf_100 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.5.res_layer0.running_var']));
    const buf_101 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.5.res_layer0.bias']));
    const buf_102 = createWeightBuf(device, 589824, getTensorBuffer(safetensor, metadata['body.list.5.conv_layer0.weight']));
    const buf_103 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.5.res_layer1.running_mean']));
    const buf_104 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.5.res_layer1.weight']));
    const buf_105 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.5.res_layer1.running_var']));
    const buf_106 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.5.res_layer1.bias']));
    const buf_107 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.5.prelu_weight']));
    const buf_108 = createWeightBuf(device, 589824, getTensorBuffer(safetensor, metadata['body.list.5.conv_layer1.weight']));
    const buf_109 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.5.res_layer2.running_mean']));
    const buf_110 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.5.res_layer2.weight']));
    const buf_111 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.5.res_layer2.running_var']));
    const buf_112 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.5.res_layer2.bias']));
    const buf_113 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.6.res_layer0.running_mean']));
    const buf_114 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.6.res_layer0.weight']));
    const buf_115 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.6.res_layer0.running_var']));
    const buf_116 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.6.res_layer0.bias']));
    const buf_117 = createWeightBuf(device, 589824, getTensorBuffer(safetensor, metadata['body.list.6.conv_layer0.weight']));
    const buf_118 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.6.res_layer1.running_mean']));
    const buf_119 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.6.res_layer1.weight']));
    const buf_120 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.6.res_layer1.running_var']));
    const buf_121 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.6.res_layer1.bias']));
    const buf_122 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.6.prelu_weight']));
    const buf_123 = createWeightBuf(device, 589824, getTensorBuffer(safetensor, metadata['body.list.6.conv_layer1.weight']));
    const buf_124 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.6.res_layer2.running_mean']));
    const buf_125 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.6.res_layer2.weight']));
    const buf_126 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.6.res_layer2.running_var']));
    const buf_127 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.6.res_layer2.bias']));
    const buf_128 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.7.res_layer0.running_mean']));
    const buf_129 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.7.res_layer0.weight']));
    const buf_130 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.7.res_layer0.running_var']));
    const buf_131 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['body.list.7.res_layer0.bias']));
    const buf_132 = createEmptyBuf(device, 200704);;
    const buf_133 = createWeightBuf(device, 131072, getTensorBuffer(safetensor, metadata['body.list.7.shortcut_layer0.weight']));
    const buf_134 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.7.shortcut_layer1.running_mean']));
    const buf_135 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.7.shortcut_layer1.weight']));
    const buf_136 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.7.shortcut_layer1.running_var']));
    const buf_137 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.7.shortcut_layer1.bias']));
    const buf_138 = createWeightBuf(device, 1179648, getTensorBuffer(safetensor, metadata['body.list.7.conv_layer0.weight']));
    const buf_139 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.7.res_layer1.running_mean']));
    const buf_140 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.7.res_layer1.weight']));
    const buf_141 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.7.res_layer1.running_var']));
    const buf_142 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.7.res_layer1.bias']));
    const buf_143 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.7.prelu_weight']));
    const buf_144 = createEmptyBuf(device, 200704);;
    const buf_145 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.7.conv_layer1.weight']));
    const buf_146 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.7.res_layer2.running_mean']));
    const buf_147 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.7.res_layer2.weight']));
    const buf_148 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.7.res_layer2.running_var']));
    const buf_149 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.7.res_layer2.bias']));
    const buf_150 = createEmptyBuf(device, 200704);;
    const buf_151 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.8.res_layer0.running_mean']));
    const buf_152 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.8.res_layer0.weight']));
    const buf_153 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.8.res_layer0.running_var']));
    const buf_154 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.8.res_layer0.bias']));
    const buf_155 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.8.conv_layer0.weight']));
    const buf_156 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.8.res_layer1.running_mean']));
    const buf_157 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.8.res_layer1.weight']));
    const buf_158 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.8.res_layer1.running_var']));
    const buf_159 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.8.res_layer1.bias']));
    const buf_160 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.8.prelu_weight']));
    const buf_161 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.8.conv_layer1.weight']));
    const buf_162 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.8.res_layer2.running_mean']));
    const buf_163 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.8.res_layer2.weight']));
    const buf_164 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.8.res_layer2.running_var']));
    const buf_165 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.8.res_layer2.bias']));
    const buf_166 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.9.res_layer0.running_mean']));
    const buf_167 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.9.res_layer0.weight']));
    const buf_168 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.9.res_layer0.running_var']));
    const buf_169 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.9.res_layer0.bias']));
    const buf_170 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.9.conv_layer0.weight']));
    const buf_171 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.9.res_layer1.running_mean']));
    const buf_172 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.9.res_layer1.weight']));
    const buf_173 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.9.res_layer1.running_var']));
    const buf_174 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.9.res_layer1.bias']));
    const buf_175 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.9.prelu_weight']));
    const buf_176 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.9.conv_layer1.weight']));
    const buf_177 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.9.res_layer2.running_mean']));
    const buf_178 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.9.res_layer2.weight']));
    const buf_179 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.9.res_layer2.running_var']));
    const buf_180 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.9.res_layer2.bias']));
    const buf_181 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.10.res_layer0.running_mean']));
    const buf_182 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.10.res_layer0.weight']));
    const buf_183 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.10.res_layer0.running_var']));
    const buf_184 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.10.res_layer0.bias']));
    const buf_185 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.10.conv_layer0.weight']));
    const buf_186 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.10.res_layer1.running_mean']));
    const buf_187 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.10.res_layer1.weight']));
    const buf_188 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.10.res_layer1.running_var']));
    const buf_189 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.10.res_layer1.bias']));
    const buf_190 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.10.prelu_weight']));
    const buf_191 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.10.conv_layer1.weight']));
    const buf_192 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.10.res_layer2.running_mean']));
    const buf_193 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.10.res_layer2.weight']));
    const buf_194 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.10.res_layer2.running_var']));
    const buf_195 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.10.res_layer2.bias']));
    const buf_196 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.11.res_layer0.running_mean']));
    const buf_197 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.11.res_layer0.weight']));
    const buf_198 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.11.res_layer0.running_var']));
    const buf_199 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.11.res_layer0.bias']));
    const buf_200 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.11.conv_layer0.weight']));
    const buf_201 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.11.res_layer1.running_mean']));
    const buf_202 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.11.res_layer1.weight']));
    const buf_203 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.11.res_layer1.running_var']));
    const buf_204 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.11.res_layer1.bias']));
    const buf_205 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.11.prelu_weight']));
    const buf_206 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.11.conv_layer1.weight']));
    const buf_207 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.11.res_layer2.running_mean']));
    const buf_208 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.11.res_layer2.weight']));
    const buf_209 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.11.res_layer2.running_var']));
    const buf_210 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.11.res_layer2.bias']));
    const buf_211 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.12.res_layer0.running_mean']));
    const buf_212 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.12.res_layer0.weight']));
    const buf_213 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.12.res_layer0.running_var']));
    const buf_214 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.12.res_layer0.bias']));
    const buf_215 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.12.conv_layer0.weight']));
    const buf_216 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.12.res_layer1.running_mean']));
    const buf_217 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.12.res_layer1.weight']));
    const buf_218 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.12.res_layer1.running_var']));
    const buf_219 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.12.res_layer1.bias']));
    const buf_220 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.12.prelu_weight']));
    const buf_221 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.12.conv_layer1.weight']));
    const buf_222 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.12.res_layer2.running_mean']));
    const buf_223 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.12.res_layer2.weight']));
    const buf_224 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.12.res_layer2.running_var']));
    const buf_225 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.12.res_layer2.bias']));
    const buf_226 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.13.res_layer0.running_mean']));
    const buf_227 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.13.res_layer0.weight']));
    const buf_228 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.13.res_layer0.running_var']));
    const buf_229 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.13.res_layer0.bias']));
    const buf_230 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.13.conv_layer0.weight']));
    const buf_231 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.13.res_layer1.running_mean']));
    const buf_232 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.13.res_layer1.weight']));
    const buf_233 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.13.res_layer1.running_var']));
    const buf_234 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.13.res_layer1.bias']));
    const buf_235 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.13.prelu_weight']));
    const buf_236 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.13.conv_layer1.weight']));
    const buf_237 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.13.res_layer2.running_mean']));
    const buf_238 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.13.res_layer2.weight']));
    const buf_239 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.13.res_layer2.running_var']));
    const buf_240 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.13.res_layer2.bias']));
    const buf_241 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.14.res_layer0.running_mean']));
    const buf_242 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.14.res_layer0.weight']));
    const buf_243 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.14.res_layer0.running_var']));
    const buf_244 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.14.res_layer0.bias']));
    const buf_245 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.14.conv_layer0.weight']));
    const buf_246 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.14.res_layer1.running_mean']));
    const buf_247 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.14.res_layer1.weight']));
    const buf_248 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.14.res_layer1.running_var']));
    const buf_249 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.14.res_layer1.bias']));
    const buf_250 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.14.prelu_weight']));
    const buf_251 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.14.conv_layer1.weight']));
    const buf_252 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.14.res_layer2.running_mean']));
    const buf_253 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.14.res_layer2.weight']));
    const buf_254 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.14.res_layer2.running_var']));
    const buf_255 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.14.res_layer2.bias']));
    const buf_256 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.15.res_layer0.running_mean']));
    const buf_257 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.15.res_layer0.weight']));
    const buf_258 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.15.res_layer0.running_var']));
    const buf_259 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.15.res_layer0.bias']));
    const buf_260 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.15.conv_layer0.weight']));
    const buf_261 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.15.res_layer1.running_mean']));
    const buf_262 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.15.res_layer1.weight']));
    const buf_263 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.15.res_layer1.running_var']));
    const buf_264 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.15.res_layer1.bias']));
    const buf_265 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.15.prelu_weight']));
    const buf_266 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.15.conv_layer1.weight']));
    const buf_267 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.15.res_layer2.running_mean']));
    const buf_268 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.15.res_layer2.weight']));
    const buf_269 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.15.res_layer2.running_var']));
    const buf_270 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.15.res_layer2.bias']));
    const buf_271 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.16.res_layer0.running_mean']));
    const buf_272 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.16.res_layer0.weight']));
    const buf_273 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.16.res_layer0.running_var']));
    const buf_274 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.16.res_layer0.bias']));
    const buf_275 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.16.conv_layer0.weight']));
    const buf_276 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.16.res_layer1.running_mean']));
    const buf_277 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.16.res_layer1.weight']));
    const buf_278 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.16.res_layer1.running_var']));
    const buf_279 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.16.res_layer1.bias']));
    const buf_280 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.16.prelu_weight']));
    const buf_281 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.16.conv_layer1.weight']));
    const buf_282 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.16.res_layer2.running_mean']));
    const buf_283 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.16.res_layer2.weight']));
    const buf_284 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.16.res_layer2.running_var']));
    const buf_285 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.16.res_layer2.bias']));
    const buf_286 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.17.res_layer0.running_mean']));
    const buf_287 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.17.res_layer0.weight']));
    const buf_288 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.17.res_layer0.running_var']));
    const buf_289 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.17.res_layer0.bias']));
    const buf_290 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.17.conv_layer0.weight']));
    const buf_291 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.17.res_layer1.running_mean']));
    const buf_292 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.17.res_layer1.weight']));
    const buf_293 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.17.res_layer1.running_var']));
    const buf_294 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.17.res_layer1.bias']));
    const buf_295 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.17.prelu_weight']));
    const buf_296 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.17.conv_layer1.weight']));
    const buf_297 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.17.res_layer2.running_mean']));
    const buf_298 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.17.res_layer2.weight']));
    const buf_299 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.17.res_layer2.running_var']));
    const buf_300 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.17.res_layer2.bias']));
    const buf_301 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.18.res_layer0.running_mean']));
    const buf_302 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.18.res_layer0.weight']));
    const buf_303 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.18.res_layer0.running_var']));
    const buf_304 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.18.res_layer0.bias']));
    const buf_305 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.18.conv_layer0.weight']));
    const buf_306 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.18.res_layer1.running_mean']));
    const buf_307 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.18.res_layer1.weight']));
    const buf_308 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.18.res_layer1.running_var']));
    const buf_309 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.18.res_layer1.bias']));
    const buf_310 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.18.prelu_weight']));
    const buf_311 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.18.conv_layer1.weight']));
    const buf_312 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.18.res_layer2.running_mean']));
    const buf_313 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.18.res_layer2.weight']));
    const buf_314 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.18.res_layer2.running_var']));
    const buf_315 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.18.res_layer2.bias']));
    const buf_316 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.19.res_layer0.running_mean']));
    const buf_317 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.19.res_layer0.weight']));
    const buf_318 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.19.res_layer0.running_var']));
    const buf_319 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.19.res_layer0.bias']));
    const buf_320 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.19.conv_layer0.weight']));
    const buf_321 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.19.res_layer1.running_mean']));
    const buf_322 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.19.res_layer1.weight']));
    const buf_323 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.19.res_layer1.running_var']));
    const buf_324 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.19.res_layer1.bias']));
    const buf_325 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.19.prelu_weight']));
    const buf_326 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.19.conv_layer1.weight']));
    const buf_327 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.19.res_layer2.running_mean']));
    const buf_328 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.19.res_layer2.weight']));
    const buf_329 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.19.res_layer2.running_var']));
    const buf_330 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.19.res_layer2.bias']));
    const buf_331 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.20.res_layer0.running_mean']));
    const buf_332 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.20.res_layer0.weight']));
    const buf_333 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.20.res_layer0.running_var']));
    const buf_334 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.20.res_layer0.bias']));
    const buf_335 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.20.conv_layer0.weight']));
    const buf_336 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.20.res_layer1.running_mean']));
    const buf_337 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.20.res_layer1.weight']));
    const buf_338 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.20.res_layer1.running_var']));
    const buf_339 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.20.res_layer1.bias']));
    const buf_340 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.20.prelu_weight']));
    const buf_341 = createWeightBuf(device, 2359296, getTensorBuffer(safetensor, metadata['body.list.20.conv_layer1.weight']));
    const buf_342 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.20.res_layer2.running_mean']));
    const buf_343 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.20.res_layer2.weight']));
    const buf_344 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.20.res_layer2.running_var']));
    const buf_345 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.20.res_layer2.bias']));
    const buf_346 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.21.res_layer0.running_mean']));
    const buf_347 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.21.res_layer0.weight']));
    const buf_348 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.21.res_layer0.running_var']));
    const buf_349 = createWeightBuf(device, 1024, getTensorBuffer(safetensor, metadata['body.list.21.res_layer0.bias']));
    const buf_350 = createEmptyBuf(device, 100352);;
    const buf_351 = createWeightBuf(device, 524288, getTensorBuffer(safetensor, metadata['body.list.21.shortcut_layer0.weight']));
    const buf_352 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.21.shortcut_layer1.running_mean']));
    const buf_353 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.21.shortcut_layer1.weight']));
    const buf_354 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.21.shortcut_layer1.running_var']));
    const buf_355 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.21.shortcut_layer1.bias']));
    const buf_356 = createWeightBuf(device, 4718592, getTensorBuffer(safetensor, metadata['body.list.21.conv_layer0.weight']));
    const buf_357 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.21.res_layer1.running_mean']));
    const buf_358 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.21.res_layer1.weight']));
    const buf_359 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.21.res_layer1.running_var']));
    const buf_360 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.21.res_layer1.bias']));
    const buf_361 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.21.prelu_weight']));
    const buf_362 = createEmptyBuf(device, 100352);;
    const buf_363 = createWeightBuf(device, 9437184, getTensorBuffer(safetensor, metadata['body.list.21.conv_layer1.weight']));
    const buf_364 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.21.res_layer2.running_mean']));
    const buf_365 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.21.res_layer2.weight']));
    const buf_366 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.21.res_layer2.running_var']));
    const buf_367 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.21.res_layer2.bias']));
    const buf_368 = createEmptyBuf(device, 100352);;
    const buf_369 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.22.res_layer0.running_mean']));
    const buf_370 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.22.res_layer0.weight']));
    const buf_371 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.22.res_layer0.running_var']));
    const buf_372 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.22.res_layer0.bias']));
    const buf_373 = createWeightBuf(device, 9437184, getTensorBuffer(safetensor, metadata['body.list.22.conv_layer0.weight']));
    const buf_374 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.22.res_layer1.running_mean']));
    const buf_375 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.22.res_layer1.weight']));
    const buf_376 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.22.res_layer1.running_var']));
    const buf_377 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.22.res_layer1.bias']));
    const buf_378 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.22.prelu_weight']));
    const buf_379 = createWeightBuf(device, 9437184, getTensorBuffer(safetensor, metadata['body.list.22.conv_layer1.weight']));
    const buf_380 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.22.res_layer2.running_mean']));
    const buf_381 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.22.res_layer2.weight']));
    const buf_382 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.22.res_layer2.running_var']));
    const buf_383 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.22.res_layer2.bias']));
    const buf_384 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.23.res_layer0.running_mean']));
    const buf_385 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.23.res_layer0.weight']));
    const buf_386 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.23.res_layer0.running_var']));
    const buf_387 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.23.res_layer0.bias']));
    const buf_388 = createWeightBuf(device, 9437184, getTensorBuffer(safetensor, metadata['body.list.23.conv_layer0.weight']));
    const buf_389 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.23.res_layer1.running_mean']));
    const buf_390 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.23.res_layer1.weight']));
    const buf_391 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.23.res_layer1.running_var']));
    const buf_392 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.23.res_layer1.bias']));
    const buf_393 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.23.prelu_weight']));
    const buf_394 = createWeightBuf(device, 9437184, getTensorBuffer(safetensor, metadata['body.list.23.conv_layer1.weight']));
    const buf_395 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.23.res_layer2.running_mean']));
    const buf_396 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.23.res_layer2.weight']));
    const buf_397 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.23.res_layer2.running_var']));
    const buf_398 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['body.list.23.res_layer2.bias']));
    const buf_399 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['bn.weight']));
    const buf_400 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['bn.running_var']));
    const buf_401 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['bn.bias']));
    const buf_402 = createWeightBuf(device, 51380224, getTensorBuffer(safetensor, metadata['linear.weight']));
    const buf_403 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['linear.bias']));
    const buf_404 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['bn2.running_mean']));
    const buf_405 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['bn2.running_var']));
    const buf_406 = createEmptyBuf(device, 4);;
    const output0 = createEmptyBuf(device, 2048);;

    const gpuWriteBuffer0 = device.createBuffer({size:input0.size, usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.MAP_WRITE });

    const gpuReadBuffer0 = device.createBuffer({size:output0.size, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });

    const kernels = [r_2_56_112_32_2_3_3_3, E_256_2, E_64_49_16_16, r_2_112_16_32_7_16_3_3_4, r_8_14_32_7_4_2_64_3_3, E_8_3136_8, r_2_8_56_32_7_64_3_3, r_2_8_56_32_7_64_3_3n1, E_8_3136_8, r_2_8_56_32_7_64_3_3, r_2_8_56_32_7_64_3_3n1, E_8_3136_8, r_28_28_8_16_64, r_4_56_32_7_8_64_3_3, r_14_4_2_16_7_2_4_128_3_3, E_128_196_4, E_128_49_16, r_4_4_28_32_7_128_3_3, r_4_4_28_32_7_128_3_3n1, E_128_49_16, r_4_4_28_32_7_128_3_3, r_4_4_28_32_7_128_3_3n1, E_128_49_16, r_4_4_28_32_7_128_3_3, r_4_4_28_32_7_128_3_3n1, E_128_49_16, r_14_16_16_14_128, r_4_28_32_7_8_128_3_3, r_14_16_16_14_256_3_3, E_32_196_8, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_7_32_16_7_256, r_16_14_32_14_256_3_3, r_7_32_16_7_512_3_3, E_256_49_2, E_256_49_2n1, r_16_7_32_7_512_3_3, r_16_7_32_7_512_3_3n1, E_256_49_2n1, r_16_7_32_7_512_3_3, r_7_32_16_7_512_3_3n1, E_128_49_4, r_512_28_896, r_128_4, E_256_2n1];
    const pipelines = await Promise.all(kernels.map(async (name, i) => {
      return await device.createComputePipelineAsync({
          layout: device.createPipelineLayout({
              bindGroupLayouts: [layouts[i]],
          }),
          compute: {
              module: device.createShaderModule({
                  code: name,
              }),
              entryPoint: "main",
          },
      });
  }))

    return async (_input0) => {
        const commandEncoder = device.createCommandEncoder();
        await gpuWriteBuffer0.mapAsync(GPUMapMode.WRITE);
        new Uint8Array(gpuWriteBuffer0.getMappedRange()).set(_input0);
        gpuWriteBuffer0.unmap();
        commandEncoder.copyBufferToBuffer(gpuWriteBuffer0, 0, input0, 0, gpuWriteBuffer0.size);
        addComputePass(device, commandEncoder, pipelines[0], layouts[0], infinityBuf, [buf_0, input0, buf_1, buf_2, buf_3, buf_4, buf_5, buf_6], [112, 56, 2]);
        addComputePass(device, commandEncoder, pipelines[1], layouts[1], infinityBuf, [buf_7, buf_8], [256, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[2], layouts[2], infinityBuf, [buf_9, buf_0, buf_10, buf_11, buf_12, buf_13], [49, 64, 1]);
        addComputePass(device, commandEncoder, pipelines[3], layouts[3], infinityBuf, [buf_14, buf_9, buf_15, buf_16, buf_17, buf_18, buf_19, buf_20], [16, 112, 2]);
        addComputePass(device, commandEncoder, pipelines[4], layouts[4], infinityBuf, [buf_21, buf_14, buf_22, buf_23, buf_24, buf_25, buf_26, buf_0], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[5], layouts[5], infinityBuf, [buf_27, buf_21, buf_28, buf_29, buf_30, buf_31], [3136, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[6], layouts[6], infinityBuf, [buf_32, buf_27, buf_33, buf_34, buf_35, buf_36, buf_37, buf_38], [56, 8, 2]);
        addComputePass(device, commandEncoder, pipelines[7], layouts[7], infinityBuf, [buf_27, buf_32, buf_39, buf_40, buf_41, buf_42, buf_43, buf_21], [56, 8, 2]);
        addComputePass(device, commandEncoder, pipelines[8], layouts[8], infinityBuf, [buf_32, buf_27, buf_44, buf_45, buf_46, buf_47], [3136, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[9], layouts[9], infinityBuf, [buf_21, buf_32, buf_48, buf_49, buf_50, buf_51, buf_52, buf_53], [56, 8, 2]);
        addComputePass(device, commandEncoder, pipelines[10], layouts[10], infinityBuf, [buf_32, buf_21, buf_54, buf_55, buf_56, buf_57, buf_58, buf_27], [56, 8, 2]);
        addComputePass(device, commandEncoder, pipelines[11], layouts[11], infinityBuf, [buf_21, buf_32, buf_59, buf_60, buf_61, buf_62], [3136, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[12], layouts[12], infinityBuf, [buf_63, buf_32, buf_64, buf_65, buf_66, buf_67, buf_68], [8, 28, 28]);
        addComputePass(device, commandEncoder, pipelines[13], layouts[13], infinityBuf, [buf_69, buf_21, buf_70, buf_71, buf_72, buf_73, buf_74, buf_75], [56, 4, 1]);
        addComputePass(device, commandEncoder, pipelines[14], layouts[14], infinityBuf, [buf_76, buf_69, buf_77, buf_78, buf_79, buf_80, buf_81], [2, 4, 14]);
        addComputePass(device, commandEncoder, pipelines[15], layouts[15], infinityBuf, [buf_82, buf_76, buf_63], [196, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[16], layouts[16], infinityBuf, [buf_76, buf_82, buf_83, buf_84, buf_85, buf_86], [49, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[17], layouts[17], infinityBuf, [buf_63, buf_76, buf_87, buf_88, buf_89, buf_90, buf_91, buf_92], [28, 4, 4]);
        addComputePass(device, commandEncoder, pipelines[18], layouts[18], infinityBuf, [buf_76, buf_63, buf_93, buf_94, buf_95, buf_96, buf_97, buf_82], [28, 4, 4]);
        addComputePass(device, commandEncoder, pipelines[19], layouts[19], infinityBuf, [buf_63, buf_76, buf_98, buf_99, buf_100, buf_101], [49, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[20], layouts[20], infinityBuf, [buf_82, buf_63, buf_102, buf_103, buf_104, buf_105, buf_106, buf_107], [28, 4, 4]);
        addComputePass(device, commandEncoder, pipelines[21], layouts[21], infinityBuf, [buf_63, buf_82, buf_108, buf_109, buf_110, buf_111, buf_112, buf_76], [28, 4, 4]);
        addComputePass(device, commandEncoder, pipelines[22], layouts[22], infinityBuf, [buf_82, buf_63, buf_113, buf_114, buf_115, buf_116], [49, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[23], layouts[23], infinityBuf, [buf_76, buf_82, buf_117, buf_118, buf_119, buf_120, buf_121, buf_122], [28, 4, 4]);
        addComputePass(device, commandEncoder, pipelines[24], layouts[24], infinityBuf, [buf_82, buf_76, buf_123, buf_124, buf_125, buf_126, buf_127, buf_63], [28, 4, 4]);
        addComputePass(device, commandEncoder, pipelines[25], layouts[25], infinityBuf, [buf_76, buf_82, buf_128, buf_129, buf_130, buf_131], [49, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[26], layouts[26], infinityBuf, [buf_132, buf_82, buf_133, buf_134, buf_135, buf_136, buf_137], [16, 14, 1]);
        addComputePass(device, commandEncoder, pipelines[27], layouts[27], infinityBuf, [buf_21, buf_76, buf_138, buf_139, buf_140, buf_141, buf_142, buf_143], [28, 4, 1]);
        addComputePass(device, commandEncoder, pipelines[28], layouts[28], infinityBuf, [buf_144, buf_21, buf_145, buf_146, buf_147, buf_148, buf_149], [16, 14, 1]);
        addComputePass(device, commandEncoder, pipelines[29], layouts[29], infinityBuf, [buf_150, buf_144, buf_132], [196, 32, 1]);
        addComputePass(device, commandEncoder, pipelines[30], layouts[30], infinityBuf, [buf_144, buf_150, buf_151, buf_152, buf_153, buf_154], [196, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[31], layouts[31], infinityBuf, [buf_132, buf_144, buf_155, buf_156, buf_157, buf_158, buf_159, buf_160], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[32], layouts[32], infinityBuf, [buf_144, buf_132, buf_161, buf_162, buf_163, buf_164, buf_165, buf_150], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[33], layouts[33], infinityBuf, [buf_132, buf_144, buf_166, buf_167, buf_168, buf_169], [196, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[34], layouts[34], infinityBuf, [buf_150, buf_132, buf_170, buf_171, buf_172, buf_173, buf_174, buf_175], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[35], layouts[35], infinityBuf, [buf_132, buf_150, buf_176, buf_177, buf_178, buf_179, buf_180, buf_144], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[36], layouts[36], infinityBuf, [buf_150, buf_132, buf_181, buf_182, buf_183, buf_184], [196, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[37], layouts[37], infinityBuf, [buf_144, buf_150, buf_185, buf_186, buf_187, buf_188, buf_189, buf_190], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[38], layouts[38], infinityBuf, [buf_150, buf_144, buf_191, buf_192, buf_193, buf_194, buf_195, buf_132], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[39], layouts[39], infinityBuf, [buf_144, buf_150, buf_196, buf_197, buf_198, buf_199], [196, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[40], layouts[40], infinityBuf, [buf_132, buf_144, buf_200, buf_201, buf_202, buf_203, buf_204, buf_205], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[41], layouts[41], infinityBuf, [buf_144, buf_132, buf_206, buf_207, buf_208, buf_209, buf_210, buf_150], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[42], layouts[42], infinityBuf, [buf_132, buf_144, buf_211, buf_212, buf_213, buf_214], [196, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[43], layouts[43], infinityBuf, [buf_150, buf_132, buf_215, buf_216, buf_217, buf_218, buf_219, buf_220], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[44], layouts[44], infinityBuf, [buf_132, buf_150, buf_221, buf_222, buf_223, buf_224, buf_225, buf_144], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[45], layouts[45], infinityBuf, [buf_150, buf_132, buf_226, buf_227, buf_228, buf_229], [196, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[46], layouts[46], infinityBuf, [buf_144, buf_150, buf_230, buf_231, buf_232, buf_233, buf_234, buf_235], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[47], layouts[47], infinityBuf, [buf_150, buf_144, buf_236, buf_237, buf_238, buf_239, buf_240, buf_132], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[48], layouts[48], infinityBuf, [buf_144, buf_150, buf_241, buf_242, buf_243, buf_244], [196, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[49], layouts[49], infinityBuf, [buf_132, buf_144, buf_245, buf_246, buf_247, buf_248, buf_249, buf_250], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[50], layouts[50], infinityBuf, [buf_144, buf_132, buf_251, buf_252, buf_253, buf_254, buf_255, buf_150], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[51], layouts[51], infinityBuf, [buf_132, buf_144, buf_256, buf_257, buf_258, buf_259], [196, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[52], layouts[52], infinityBuf, [buf_150, buf_132, buf_260, buf_261, buf_262, buf_263, buf_264, buf_265], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[53], layouts[53], infinityBuf, [buf_132, buf_150, buf_266, buf_267, buf_268, buf_269, buf_270, buf_144], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[54], layouts[54], infinityBuf, [buf_150, buf_132, buf_271, buf_272, buf_273, buf_274], [196, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[55], layouts[55], infinityBuf, [buf_144, buf_150, buf_275, buf_276, buf_277, buf_278, buf_279, buf_280], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[56], layouts[56], infinityBuf, [buf_150, buf_144, buf_281, buf_282, buf_283, buf_284, buf_285, buf_132], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[57], layouts[57], infinityBuf, [buf_144, buf_150, buf_286, buf_287, buf_288, buf_289], [196, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[58], layouts[58], infinityBuf, [buf_132, buf_144, buf_290, buf_291, buf_292, buf_293, buf_294, buf_295], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[59], layouts[59], infinityBuf, [buf_144, buf_132, buf_296, buf_297, buf_298, buf_299, buf_300, buf_150], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[60], layouts[60], infinityBuf, [buf_132, buf_144, buf_301, buf_302, buf_303, buf_304], [196, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[61], layouts[61], infinityBuf, [buf_150, buf_132, buf_305, buf_306, buf_307, buf_308, buf_309, buf_310], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[62], layouts[62], infinityBuf, [buf_132, buf_150, buf_311, buf_312, buf_313, buf_314, buf_315, buf_144], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[63], layouts[63], infinityBuf, [buf_150, buf_132, buf_316, buf_317, buf_318, buf_319], [196, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[64], layouts[64], infinityBuf, [buf_144, buf_150, buf_320, buf_321, buf_322, buf_323, buf_324, buf_325], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[65], layouts[65], infinityBuf, [buf_150, buf_144, buf_326, buf_327, buf_328, buf_329, buf_330, buf_132], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[66], layouts[66], infinityBuf, [buf_144, buf_150, buf_331, buf_332, buf_333, buf_334], [196, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[67], layouts[67], infinityBuf, [buf_132, buf_144, buf_335, buf_336, buf_337, buf_338, buf_339, buf_340], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[68], layouts[68], infinityBuf, [buf_144, buf_132, buf_341, buf_342, buf_343, buf_344, buf_345, buf_150], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[69], layouts[69], infinityBuf, [buf_132, buf_144, buf_346, buf_347, buf_348, buf_349], [196, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[70], layouts[70], infinityBuf, [buf_350, buf_144, buf_351, buf_352, buf_353, buf_354, buf_355], [32, 7, 1]);
        addComputePass(device, commandEncoder, pipelines[71], layouts[71], infinityBuf, [buf_76, buf_132, buf_356, buf_357, buf_358, buf_359, buf_360, buf_361], [14, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[72], layouts[72], infinityBuf, [buf_362, buf_76, buf_363, buf_364, buf_365, buf_366, buf_367], [32, 7, 1]);
        addComputePass(device, commandEncoder, pipelines[73], layouts[73], infinityBuf, [buf_368, buf_362, buf_350], [49, 256, 1]);
        addComputePass(device, commandEncoder, pipelines[74], layouts[74], infinityBuf, [buf_362, buf_368, buf_369, buf_370, buf_371, buf_372], [49, 256, 1]);
        addComputePass(device, commandEncoder, pipelines[75], layouts[75], infinityBuf, [buf_350, buf_362, buf_373, buf_374, buf_375, buf_376, buf_377, buf_378], [7, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[76], layouts[76], infinityBuf, [buf_362, buf_350, buf_379, buf_380, buf_381, buf_382, buf_383, buf_368], [7, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[77], layouts[77], infinityBuf, [buf_350, buf_362, buf_384, buf_385, buf_386, buf_387], [49, 256, 1]);
        addComputePass(device, commandEncoder, pipelines[78], layouts[78], infinityBuf, [buf_368, buf_350, buf_388, buf_389, buf_390, buf_391, buf_392, buf_393], [7, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[79], layouts[79], infinityBuf, [buf_350, buf_368, buf_394, buf_395, buf_396, buf_397, buf_398, buf_362], [32, 7, 1]);
        addComputePass(device, commandEncoder, pipelines[80], layouts[80], infinityBuf, [buf_368, buf_350, buf_7, buf_399, buf_400, buf_401], [49, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[81], layouts[81], infinityBuf, [buf_7, buf_368, buf_402, buf_403, buf_404, buf_405], [512, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[82], layouts[82], infinityBuf, [buf_406, buf_7], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[83], layouts[83], infinityBuf, [output0, buf_7, buf_406], [256, 1, 1]);
        commandEncoder.copyBufferToBuffer(output0, 0, gpuReadBuffer0, 0, output0.size);
        const gpuCommands = commandEncoder.finish();
        device.queue.submit([gpuCommands]);

        await gpuReadBuffer0.mapAsync(GPUMapMode.READ);
        const resultBuffer0 = new Float32Array(gpuReadBuffer0.size/4);
        resultBuffer0.set(new Float32Array(gpuReadBuffer0.getMappedRange()));
        gpuReadBuffer0.unmap();
        return [resultBuffer0];
    }
}
const load = async (device, weight_path) => { return await fetch(weight_path).then(x => x.arrayBuffer()).then(x => setupNet(device, new Uint8Array(x))); }
return { load, setupNet };
})();
export default ADAFACE;
