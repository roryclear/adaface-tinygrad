
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

const r_16_28_7_16_4_4_3_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,16>;
  var gidx0 = i32(gindex.x); /* 7 */
  var gidx1 = i32(gindex.y); /* 28 */
  var gidx2 = i32(gindex.z); /* 16 */
  var lidx0 = i32(lindex.x); /* 16 */
  var alu0 = (lidx0+bitcast<i32>((bitcast<u32>(gidx0)<<4u)));
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
  for (var Ridx0 = 0; Ridx0 < 3; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu17 = ((bitcast<i32>((bitcast<u32>(gidx1)<<2u))+Ridx1)<110);
      var alu18 = (0<(gidx1+Ridx1));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu19 = ((((gidx0*48)+(lidx0*3)+(Ridx2*3))-Ridx0)+(gidx1*1344)+(Ridx1*336));
        var alu20 = (alu19+-337);
        var alu21 = select(0,3,(alu20<0));
        var alu22 = ((0<(gidx0+lidx0+Ridx2))&((alu0+Ridx2)<113));
        var val0 = select(0u, atomicLoad(&data1_37632[((alu20+alu21)>>2u)]), (alu22&alu18));
        var alu23 = (alu19+-1);
        var alu24 = select(0,3,(alu23<0));
        var val1 = select(0u, atomicLoad(&data1_37632[((alu23+alu24)>>2u)]), alu22);
        var alu25 = (alu19+335);
        var val2 = select(0u, atomicLoad(&data1_37632[(alu25>>2u)]), alu22);
        var alu26 = (alu19+671);
        var val3 = select(0u, atomicLoad(&data1_37632[(alu26>>2u)]), (alu22&alu17));
        var alu27 = ((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx2*108));
        var val4 = data2_1728[alu27];
        var val5 = data2_1728[(alu27+27)];
        var val6 = data2_1728[(alu27+54)];
        var val7 = data2_1728[(alu27+81)];
        var alu28 = select(0.0f,((((f32((u32(((val0>>(((u32(alu20))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),(alu18&alu22));
        var alu29 = select(0.0f,((((f32((u32(((val1>>(((u32(alu23))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),alu22);
        var alu30 = select(0.0f,((((f32((u32(((val2>>(((u32(alu25))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),alu22);
        var alu31 = select(0.0f,((((f32((u32(((val3>>(((u32(alu26))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),(alu17&alu22));
        acc0[0] = (acc0[0]+(alu28*val4));
        acc0[1] = (acc0[1]+(alu29*val4));
        acc0[2] = (acc0[2]+(alu30*val4));
        acc0[3] = (acc0[3]+(alu31*val4));
        acc0[4] = (acc0[4]+(alu28*val5));
        acc0[5] = (acc0[5]+(alu29*val5));
        acc0[6] = (acc0[6]+(alu30*val5));
        acc0[7] = (acc0[7]+(alu31*val5));
        acc0[8] = (acc0[8]+(alu28*val6));
        acc0[9] = (acc0[9]+(alu29*val6));
        acc0[10] = (acc0[10]+(alu30*val6));
        acc0[11] = (acc0[11]+(alu31*val6));
        acc0[12] = (acc0[12]+(alu28*val7));
        acc0[13] = (acc0[13]+(alu29*val7));
        acc0[14] = (acc0[14]+(alu30*val7));
        acc0[15] = (acc0[15]+(alu31*val7));
      }
    }
  }
  var cast0 = bitcast<i32>((bitcast<u32>(gidx2)<<2u));
  var val8 = data3_64[cast0];
  var val9 = data4_64[cast0];
  var val10 = data5_64[cast0];
  var val11 = data6_64[cast0];
  var val12 = data7_64[cast0];
  var alu51 = (cast0+1);
  var val13 = data3_64[alu51];
  var val14 = data4_64[alu51];
  var val15 = data5_64[alu51];
  var val16 = data6_64[alu51];
  var val17 = data7_64[alu51];
  var alu52 = (cast0+2);
  var val18 = data3_64[alu52];
  var val19 = data4_64[alu52];
  var val20 = data5_64[alu52];
  var val21 = data6_64[alu52];
  var val22 = data7_64[alu52];
  var alu53 = (cast0+3);
  var val23 = data3_64[alu53];
  var val24 = data4_64[alu53];
  var val25 = data5_64[alu53];
  var val26 = data6_64[alu53];
  var val27 = data7_64[alu53];
  var alu54 = (alu0+(gidx1*448)+(gidx2*50176));
  var alu55 = (1/sqrt((val10+1e-05f)));
  var alu56 = (1/sqrt((val15+1e-05f)));
  var alu57 = (1/sqrt((val20+1e-05f)));
  var alu58 = (1/sqrt((val25+1e-05f)));
  var alu59 = (((acc0[0]-val8)*val9*alu55)+val11);
  var alu60 = (((acc0[1]-val8)*val9*alu55)+val11);
  var alu61 = (((acc0[2]-val8)*val9*alu55)+val11);
  var alu62 = (((acc0[3]-val8)*val9*alu55)+val11);
  var alu63 = (((acc0[4]-val13)*val14*alu56)+val16);
  var alu64 = (((acc0[5]-val13)*val14*alu56)+val16);
  var alu65 = (((acc0[6]-val13)*val14*alu56)+val16);
  var alu66 = (((acc0[7]-val13)*val14*alu56)+val16);
  var alu67 = (((acc0[8]-val18)*val19*alu57)+val21);
  var alu68 = (((acc0[9]-val18)*val19*alu57)+val21);
  var alu69 = (((acc0[10]-val18)*val19*alu57)+val21);
  var alu70 = (((acc0[11]-val18)*val19*alu57)+val21);
  var alu71 = (((acc0[12]-val23)*val24*alu58)+val26);
  var alu72 = (((acc0[13]-val23)*val24*alu58)+val26);
  var alu73 = (((acc0[14]-val23)*val24*alu58)+val26);
  var alu74 = (((acc0[15]-val23)*val24*alu58)+val26);
  var alu75 = select((val12*alu59),alu59,(0.0f<alu59));
  var alu76 = select((val12*alu60),alu60,(0.0f<alu60));
  var alu77 = select((val12*alu61),alu61,(0.0f<alu61));
  var alu78 = select((val12*alu62),alu62,(0.0f<alu62));
  var alu79 = select((val17*alu63),alu63,(0.0f<alu63));
  var alu80 = select((val17*alu64),alu64,(0.0f<alu64));
  var alu81 = select((val17*alu65),alu65,(0.0f<alu65));
  var alu82 = select((val17*alu66),alu66,(0.0f<alu66));
  var alu83 = select((val22*alu67),alu67,(0.0f<alu67));
  var alu84 = select((val22*alu68),alu68,(0.0f<alu68));
  var alu85 = select((val22*alu69),alu69,(0.0f<alu69));
  var alu86 = select((val22*alu70),alu70,(0.0f<alu70));
  var alu87 = select((val27*alu71),alu71,(0.0f<alu71));
  var alu88 = select((val27*alu72),alu72,(0.0f<alu72));
  var alu89 = select((val27*alu73),alu73,(0.0f<alu73));
  var alu90 = select((val27*alu74),alu74,(0.0f<alu74));
  data0_802816[alu54] = alu75;
  data0_802816[(alu54+112)] = alu76;
  data0_802816[(alu54+224)] = alu77;
  data0_802816[(alu54+336)] = alu78;
  data0_802816[(alu54+12544)] = alu79;
  data0_802816[(alu54+12656)] = alu80;
  data0_802816[(alu54+12768)] = alu81;
  data0_802816[(alu54+12880)] = alu82;
  data0_802816[(alu54+25088)] = alu83;
  data0_802816[(alu54+25200)] = alu84;
  data0_802816[(alu54+25312)] = alu85;
  data0_802816[(alu54+25424)] = alu86;
  data0_802816[(alu54+37632)] = alu87;
  data0_802816[(alu54+37744)] = alu88;
  data0_802816[(alu54+37856)] = alu89;
  data0_802816[(alu54+37968)] = alu90;
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

const E_64_784_16 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_802816:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_802816:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_64:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_64:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_64:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_64:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 784 */
  var gidx1 = i32(gindex.y); /* 64 */
  var lidx0 = i32(lindex.x); /* 16 */
  var alu0 = (lidx0+bitcast<i32>((bitcast<u32>(gidx0)<<4u))+(gidx1*12544));
  var val0 = data1_802816[alu0];
  var val1 = data2_64[gidx1];
  var val2 = data3_64[gidx1];
  var val3 = data4_64[gidx1];
  var val4 = data5_64[gidx1];
  data0_802816[alu0] = (((val0-val1)*val2*(1/sqrt((val3+1e-05f))))+val4);
}`;

const r_16_56_32_7_2_2_64_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  var acc0: array<f32,28>;
  var gidx0 = i32(gindex.x); /* 56 */
  var gidx1 = i32(gindex.y); /* 16 */
  var lidx0 = i32(lindex.x); /* 32 */
  var cast0 = bitcast<i32>((bitcast<u32>(gidx0)<<1u));
  var alu0 = (gidx1*784);
  var alu1 = (gidx1<15);
  var alu2 = (0<gidx1);
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
  for (var Ridx0 = 0; Ridx0 < 64; Ridx0++) {
    for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
      var alu31 = (cast0+Ridx2);
      var alu32 = (alu31+alu0+(Ridx0*12544));
      var alu33 = (0<(gidx0+Ridx2));
      var val0 = select(0.0f, data1_802816[(alu32+-113)], (alu33&alu2));
      var alu34 = ((Ridx0*9)+Ridx2+(lidx0*576));
      var val1 = data2_36864[(alu34+3)];
      var val2 = data2_36864[alu34];
      var alu35 = (alu31<112);
      var val3 = select(0.0f, data1_802816[(alu32+-112)], (alu35&alu2));
      var val4 = select(0.0f, data1_802816[(alu32+-1)], alu33);
      var val5 = select(0.0f, data1_802816[(alu32+111)], alu33);
      var val6 = data2_36864[(alu34+6)];
      var val7 = select(0.0f, data1_802816[alu32], alu35);
      var val8 = select(0.0f, data1_802816[(alu32+112)], alu35);
      var val9 = data2_36864[(alu34+18432)];
      var val10 = data2_36864[(alu34+18435)];
      var val11 = data2_36864[(alu34+18438)];
      var val12 = select(0.0f, data1_802816[(alu32+223)], alu33);
      var val13 = select(0.0f, data1_802816[(alu32+224)], alu35);
      var val14 = select(0.0f, data1_802816[(alu32+335)], alu33);
      var val15 = select(0.0f, data1_802816[(alu32+336)], alu35);
      var val16 = select(0.0f, data1_802816[(alu32+447)], alu33);
      var val17 = select(0.0f, data1_802816[(alu32+448)], alu35);
      var val18 = select(0.0f, data1_802816[(alu32+559)], alu33);
      var val19 = select(0.0f, data1_802816[(alu32+560)], alu35);
      var val20 = select(0.0f, data1_802816[(alu32+671)], alu33);
      var val21 = select(0.0f, data1_802816[(alu32+672)], alu35);
      var val22 = select(0.0f, data1_802816[(alu32+783)], (alu33&alu1));
      var val23 = select(0.0f, data1_802816[(alu32+784)], (alu35&alu1));
      acc0[0] = (acc0[0]+(val0*val2)+(val4*val1)+(val5*val6));
      acc0[1] = (acc0[1]+(val3*val2)+(val7*val1)+(val8*val6));
      acc0[2] = (acc0[2]+(val0*val9)+(val4*val10)+(val5*val11));
      acc0[3] = (acc0[3]+(val3*val9)+(val7*val10)+(val8*val11));
      acc0[4] = (acc0[4]+(val4*val2)+(val5*val1)+(val12*val6));
      acc0[5] = (acc0[5]+(val7*val2)+(val8*val1)+(val13*val6));
      acc0[6] = (acc0[6]+(val4*val9)+(val5*val10)+(val12*val11));
      acc0[7] = (acc0[7]+(val7*val9)+(val8*val10)+(val13*val11));
      acc0[8] = (acc0[8]+(val5*val2)+(val12*val1)+(val14*val6));
      acc0[9] = (acc0[9]+(val8*val2)+(val13*val1)+(val15*val6));
      acc0[10] = (acc0[10]+(val5*val9)+(val12*val10)+(val14*val11));
      acc0[11] = (acc0[11]+(val8*val9)+(val13*val10)+(val15*val11));
      acc0[12] = (acc0[12]+(val12*val2)+(val14*val1)+(val16*val6));
      acc0[13] = (acc0[13]+(val13*val2)+(val15*val1)+(val17*val6));
      acc0[14] = (acc0[14]+(val12*val9)+(val14*val10)+(val16*val11));
      acc0[15] = (acc0[15]+(val13*val9)+(val15*val10)+(val17*val11));
      acc0[16] = (acc0[16]+(val14*val2)+(val16*val1)+(val18*val6));
      acc0[17] = (acc0[17]+(val15*val2)+(val17*val1)+(val19*val6));
      acc0[18] = (acc0[18]+(val14*val9)+(val16*val10)+(val18*val11));
      acc0[19] = (acc0[19]+(val15*val9)+(val17*val10)+(val19*val11));
      acc0[20] = (acc0[20]+(val16*val2)+(val18*val1)+(val20*val6));
      acc0[21] = (acc0[21]+(val17*val2)+(val19*val1)+(val21*val6));
      acc0[22] = (acc0[22]+(val16*val9)+(val18*val10)+(val20*val11));
      acc0[23] = (acc0[23]+(val17*val9)+(val19*val10)+(val21*val11));
      acc0[24] = (acc0[24]+(val18*val2)+(val20*val1)+(val22*val6));
      acc0[25] = (acc0[25]+(val19*val2)+(val21*val1)+(val23*val6));
      acc0[26] = (acc0[26]+(val18*val9)+(val20*val10)+(val22*val11));
      acc0[27] = (acc0[27]+(val19*val9)+(val21*val10)+(val23*val11));
    }
  }
  var val24 = data3_64[lidx0];
  var val25 = data4_64[lidx0];
  var val26 = data5_64[lidx0];
  var val27 = data6_64[lidx0];
  var val28 = data7_64[lidx0];
  var alu66 = (lidx0+32);
  var val29 = data3_64[alu66];
  var val30 = data4_64[alu66];
  var val31 = data5_64[alu66];
  var val32 = data6_64[alu66];
  var val33 = data7_64[alu66];
  var alu67 = (cast0+alu0+(lidx0*12544));
  var alu68 = (1/sqrt((val26+1e-05f)));
  var alu69 = (((acc0[0]-val24)*val25*alu68)+val27);
  var alu70 = (((acc0[1]-val24)*val25*alu68)+val27);
  var alu71 = select((val28*alu69),alu69,(0.0f<alu69));
  var alu72 = select((val28*alu70),alu70,(0.0f<alu70));
  data0_802816[alu67] = alu71;
  data0_802816[(alu67+1)] = alu72;
  var alu75 = (((acc0[4]-val24)*val25*alu68)+val27);
  var alu76 = (((acc0[5]-val24)*val25*alu68)+val27);
  var alu77 = select((val28*alu75),alu75,(0.0f<alu75));
  var alu78 = select((val28*alu76),alu76,(0.0f<alu76));
  data0_802816[(alu67+112)] = alu77;
  data0_802816[(alu67+113)] = alu78;
  var alu81 = (((acc0[8]-val24)*val25*alu68)+val27);
  var alu82 = (((acc0[9]-val24)*val25*alu68)+val27);
  var alu83 = select((val28*alu81),alu81,(0.0f<alu81));
  var alu84 = select((val28*alu82),alu82,(0.0f<alu82));
  data0_802816[(alu67+224)] = alu83;
  data0_802816[(alu67+225)] = alu84;
  var alu87 = (((acc0[12]-val24)*val25*alu68)+val27);
  var alu88 = (((acc0[13]-val24)*val25*alu68)+val27);
  var alu89 = select((val28*alu87),alu87,(0.0f<alu87));
  var alu90 = select((val28*alu88),alu88,(0.0f<alu88));
  data0_802816[(alu67+336)] = alu89;
  data0_802816[(alu67+337)] = alu90;
  var alu93 = (((acc0[16]-val24)*val25*alu68)+val27);
  var alu94 = (((acc0[17]-val24)*val25*alu68)+val27);
  var alu95 = select((val28*alu93),alu93,(0.0f<alu93));
  var alu96 = select((val28*alu94),alu94,(0.0f<alu94));
  data0_802816[(alu67+448)] = alu95;
  data0_802816[(alu67+449)] = alu96;
  var alu99 = (((acc0[20]-val24)*val25*alu68)+val27);
  var alu100 = (((acc0[21]-val24)*val25*alu68)+val27);
  var alu101 = select((val28*alu99),alu99,(0.0f<alu99));
  var alu102 = select((val28*alu100),alu100,(0.0f<alu100));
  data0_802816[(alu67+560)] = alu101;
  data0_802816[(alu67+561)] = alu102;
  var alu105 = (((acc0[24]-val24)*val25*alu68)+val27);
  var alu106 = (((acc0[25]-val24)*val25*alu68)+val27);
  var alu107 = select((val28*alu105),alu105,(0.0f<alu105));
  var alu108 = select((val28*alu106),alu106,(0.0f<alu106));
  data0_802816[(alu67+672)] = alu107;
  data0_802816[(alu67+673)] = alu108;
  var alu111 = (1/sqrt((val31+1e-05f)));
  var alu112 = (((acc0[2]-val29)*val30*alu111)+val32);
  var alu113 = (((acc0[3]-val29)*val30*alu111)+val32);
  var alu114 = select((val33*alu112),alu112,(0.0f<alu112));
  var alu115 = select((val33*alu113),alu113,(0.0f<alu113));
  data0_802816[(alu67+401408)] = alu114;
  data0_802816[(alu67+401409)] = alu115;
  var alu118 = (((acc0[6]-val29)*val30*alu111)+val32);
  var alu119 = (((acc0[7]-val29)*val30*alu111)+val32);
  var alu120 = select((val33*alu118),alu118,(0.0f<alu118));
  var alu121 = select((val33*alu119),alu119,(0.0f<alu119));
  data0_802816[(alu67+401520)] = alu120;
  data0_802816[(alu67+401521)] = alu121;
  var alu124 = (((acc0[10]-val29)*val30*alu111)+val32);
  var alu125 = (((acc0[11]-val29)*val30*alu111)+val32);
  var alu126 = select((val33*alu124),alu124,(0.0f<alu124));
  var alu127 = select((val33*alu125),alu125,(0.0f<alu125));
  data0_802816[(alu67+401632)] = alu126;
  data0_802816[(alu67+401633)] = alu127;
  var alu130 = (((acc0[14]-val29)*val30*alu111)+val32);
  var alu131 = (((acc0[15]-val29)*val30*alu111)+val32);
  var alu132 = select((val33*alu130),alu130,(0.0f<alu130));
  var alu133 = select((val33*alu131),alu131,(0.0f<alu131));
  data0_802816[(alu67+401744)] = alu132;
  data0_802816[(alu67+401745)] = alu133;
  var alu136 = (((acc0[18]-val29)*val30*alu111)+val32);
  var alu137 = (((acc0[19]-val29)*val30*alu111)+val32);
  var alu138 = select((val33*alu136),alu136,(0.0f<alu136));
  var alu139 = select((val33*alu137),alu137,(0.0f<alu137));
  data0_802816[(alu67+401856)] = alu138;
  data0_802816[(alu67+401857)] = alu139;
  var alu142 = (((acc0[22]-val29)*val30*alu111)+val32);
  var alu143 = (((acc0[23]-val29)*val30*alu111)+val32);
  var alu144 = select((val33*alu142),alu142,(0.0f<alu142));
  var alu145 = select((val33*alu143),alu143,(0.0f<alu143));
  data0_802816[(alu67+401968)] = alu144;
  data0_802816[(alu67+401969)] = alu145;
  var alu148 = (((acc0[26]-val29)*val30*alu111)+val32);
  var alu149 = (((acc0[27]-val29)*val30*alu111)+val32);
  var alu150 = select((val33*alu148),alu148,(0.0f<alu148));
  var alu151 = select((val33*alu149),alu149,(0.0f<alu149));
  data0_802816[(alu67+402080)] = alu150;
  data0_802816[(alu67+402081)] = alu151;
}`;

const r_2_8_56_32_7_64_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  var acc0: array<f32,7>;
  var gidx0 = i32(gindex.x); /* 56 */
  var gidx1 = i32(gindex.y); /* 8 */
  var gidx2 = i32(gindex.z); /* 2 */
  var lidx0 = i32(lindex.x); /* 32 */
  var cast0 = bitcast<i32>((bitcast<u32>(gidx0)<<1u));
  var alu0 = (gidx1*1568);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 64; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu8 = ((gidx1*14)+Ridx1+(Ridx0*112)+-1);
      var alu9 = select(0,1,(alu8<0));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu10 = (cast0+Ridx2);
        var alu11 = (alu10+alu0+(Ridx1*112)+(Ridx0*12544));
        var alu12 = (alu11+-113);
        var alu13 = select(0,255,(alu12<0));
        var alu14 = (0<(gidx0+Ridx2));
        var val0 = select(0.0f, data1_802816[(alu10+((alu8-(112*(((alu8*9363)>>20u)+alu9)))*112)+(((((alu12+alu13)>>8u)*2675)>>17u)*12544)+-1)], (alu14&(0<(gidx1+Ridx1))));
        var val1 = data2_36864[((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx2*18432)+(lidx0*576))];
        var val2 = select(0.0f, data1_802816[(alu11+111)], alu14);
        var val3 = select(0.0f, data1_802816[(alu11+335)], alu14);
        var val4 = select(0.0f, data1_802816[(alu11+559)], alu14);
        var val5 = select(0.0f, data1_802816[(alu11+783)], alu14);
        var val6 = select(0.0f, data1_802816[(alu11+1007)], alu14);
        var val7 = select(0.0f, data1_802816[(alu11+1231)], alu14);
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
  var alu25 = (lidx0+bitcast<i32>((bitcast<u32>(gidx2)<<5u)));
  var val8 = data3_64[alu25];
  var val9 = data4_64[alu25];
  var val10 = data5_64[alu25];
  var val11 = data6_64[alu25];
  var alu26 = (cast0+alu0+(gidx2*401408)+(lidx0*12544));
  var val12 = data7_802816[alu26];
  var val13 = data7_802816[(alu26+224)];
  var val14 = data7_802816[(alu26+448)];
  var val15 = data7_802816[(alu26+672)];
  var val16 = data7_802816[(alu26+896)];
  var val17 = data7_802816[(alu26+1120)];
  var val18 = data7_802816[(alu26+1344)];
  var alu27 = (gidx0+(gidx1*392)+(gidx2*100352)+(lidx0*3136));
  var alu28 = (1/sqrt((val10+1e-05f)));
  data0_200704[alu27] = (((acc0[0]-val8)*val9*alu28)+val11+val12);
  data0_200704[(alu27+56)] = (((acc0[1]-val8)*val9*alu28)+val11+val13);
  data0_200704[(alu27+112)] = (((acc0[2]-val8)*val9*alu28)+val11+val14);
  data0_200704[(alu27+168)] = (((acc0[3]-val8)*val9*alu28)+val11+val15);
  data0_200704[(alu27+224)] = (((acc0[4]-val8)*val9*alu28)+val11+val16);
  data0_200704[(alu27+280)] = (((acc0[5]-val8)*val9*alu28)+val11+val17);
  data0_200704[(alu27+336)] = (((acc0[6]-val8)*val9*alu28)+val11+val18);
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

const r_2_8_14_32_7_4_64_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  var acc0: array<f32,28>;
  var gidx0 = i32(gindex.x); /* 14 */
  var gidx1 = i32(gindex.y); /* 8 */
  var gidx2 = i32(gindex.z); /* 2 */
  var lidx0 = i32(lindex.x); /* 32 */
  var cast0 = bitcast<i32>((bitcast<u32>(gidx0)<<2u));
  var alu0 = (gidx1*392);
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
  for (var Ridx0 = 0; Ridx0 < 64; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu29 = (((gidx1*7)+Ridx1)<51);
      var alu30 = (0<(gidx1+Ridx1));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu31 = (cast0+Ridx2);
        var alu32 = (alu31+alu0+(Ridx1*56)+(Ridx0*3136));
        var alu33 = (0<(gidx0+Ridx2));
        var val0 = select(0.0f, data1_200704[(alu32+-57)], (alu33&alu30));
        var val1 = data2_36864[((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx2*18432)+(lidx0*576))];
        var val2 = select(0.0f, data1_200704[(alu32+-56)], alu30);
        var val3 = data1_200704[alu32];
        var val4 = select(0.0f, data1_200704[(alu32+-55)], alu30);
        var alu34 = (alu31<54);
        var val5 = select(0.0f, data1_200704[(alu32+-54)], (alu34&alu30));
        var val6 = select(0.0f, data1_200704[(alu32+-1)], alu33);
        var val7 = data1_200704[(alu32+1)];
        var val8 = select(0.0f, data1_200704[(alu32+2)], alu34);
        var val9 = select(0.0f, data1_200704[(alu32+55)], alu33);
        var val10 = data1_200704[(alu32+56)];
        var val11 = data1_200704[(alu32+57)];
        var val12 = select(0.0f, data1_200704[(alu32+58)], alu34);
        var val13 = select(0.0f, data1_200704[(alu32+111)], alu33);
        var val14 = data1_200704[(alu32+112)];
        var val15 = data1_200704[(alu32+113)];
        var val16 = select(0.0f, data1_200704[(alu32+114)], alu34);
        var val17 = select(0.0f, data1_200704[(alu32+167)], alu33);
        var val18 = data1_200704[(alu32+168)];
        var val19 = data1_200704[(alu32+169)];
        var val20 = select(0.0f, data1_200704[(alu32+170)], alu34);
        var val21 = select(0.0f, data1_200704[(alu32+223)], alu33);
        var val22 = data1_200704[(alu32+224)];
        var val23 = data1_200704[(alu32+225)];
        var val24 = select(0.0f, data1_200704[(alu32+226)], alu34);
        var val25 = select(0.0f, data1_200704[(alu32+279)], (alu33&alu29));
        var val26 = select(0.0f, data1_200704[(alu32+280)], alu29);
        var val27 = select(0.0f, data1_200704[(alu32+281)], alu29);
        var val28 = select(0.0f, data1_200704[(alu32+282)], (alu34&alu29));
        acc0[0] = (acc0[0]+(val0*val1));
        acc0[1] = (acc0[1]+(val2*val1));
        acc0[2] = (acc0[2]+(val4*val1));
        acc0[3] = (acc0[3]+(val5*val1));
        acc0[4] = (acc0[4]+(val6*val1));
        acc0[5] = (acc0[5]+(val3*val1));
        acc0[6] = (acc0[6]+(val7*val1));
        acc0[7] = (acc0[7]+(val8*val1));
        acc0[8] = (acc0[8]+(val9*val1));
        acc0[9] = (acc0[9]+(val10*val1));
        acc0[10] = (acc0[10]+(val11*val1));
        acc0[11] = (acc0[11]+(val12*val1));
        acc0[12] = (acc0[12]+(val13*val1));
        acc0[13] = (acc0[13]+(val14*val1));
        acc0[14] = (acc0[14]+(val15*val1));
        acc0[15] = (acc0[15]+(val16*val1));
        acc0[16] = (acc0[16]+(val17*val1));
        acc0[17] = (acc0[17]+(val18*val1));
        acc0[18] = (acc0[18]+(val19*val1));
        acc0[19] = (acc0[19]+(val20*val1));
        acc0[20] = (acc0[20]+(val21*val1));
        acc0[21] = (acc0[21]+(val22*val1));
        acc0[22] = (acc0[22]+(val23*val1));
        acc0[23] = (acc0[23]+(val24*val1));
        acc0[24] = (acc0[24]+(val25*val1));
        acc0[25] = (acc0[25]+(val26*val1));
        acc0[26] = (acc0[26]+(val27*val1));
        acc0[27] = (acc0[27]+(val28*val1));
      }
    }
  }
  var alu66 = (lidx0+bitcast<i32>((bitcast<u32>(gidx2)<<5u)));
  var val29 = data3_64[alu66];
  var val30 = data4_64[alu66];
  var val31 = data5_64[alu66];
  var val32 = data6_64[alu66];
  var alu67 = (cast0+alu0+(gidx2*100352)+(lidx0*3136));
  var val33 = data7_200704[alu67];
  var alu68 = (alu67+1);
  var val34 = data7_200704[alu68];
  var alu69 = (alu67+2);
  var val35 = data7_200704[alu69];
  var alu70 = (alu67+3);
  var val36 = data7_200704[alu70];
  var alu71 = (alu67+56);
  var val37 = data7_200704[alu71];
  var alu72 = (alu67+57);
  var val38 = data7_200704[alu72];
  var alu73 = (alu67+58);
  var val39 = data7_200704[alu73];
  var alu74 = (alu67+59);
  var val40 = data7_200704[alu74];
  var alu75 = (alu67+112);
  var val41 = data7_200704[alu75];
  var alu76 = (alu67+113);
  var val42 = data7_200704[alu76];
  var alu77 = (alu67+114);
  var val43 = data7_200704[alu77];
  var alu78 = (alu67+115);
  var val44 = data7_200704[alu78];
  var alu79 = (alu67+168);
  var val45 = data7_200704[alu79];
  var alu80 = (alu67+169);
  var val46 = data7_200704[alu80];
  var alu81 = (alu67+170);
  var val47 = data7_200704[alu81];
  var alu82 = (alu67+171);
  var val48 = data7_200704[alu82];
  var alu83 = (alu67+224);
  var val49 = data7_200704[alu83];
  var alu84 = (alu67+225);
  var val50 = data7_200704[alu84];
  var alu85 = (alu67+226);
  var val51 = data7_200704[alu85];
  var alu86 = (alu67+227);
  var val52 = data7_200704[alu86];
  var alu87 = (alu67+280);
  var val53 = data7_200704[alu87];
  var alu88 = (alu67+281);
  var val54 = data7_200704[alu88];
  var alu89 = (alu67+282);
  var val55 = data7_200704[alu89];
  var alu90 = (alu67+283);
  var val56 = data7_200704[alu90];
  var alu91 = (alu67+336);
  var val57 = data7_200704[alu91];
  var alu92 = (alu67+337);
  var val58 = data7_200704[alu92];
  var alu93 = (alu67+338);
  var val59 = data7_200704[alu93];
  var alu94 = (alu67+339);
  var val60 = data7_200704[alu94];
  var alu95 = (1/sqrt((val31+1e-05f)));
  data0_200704[alu67] = (((acc0[0]-val29)*val30*alu95)+val32+val33);
  data0_200704[alu68] = (((acc0[1]-val29)*val30*alu95)+val32+val34);
  data0_200704[alu69] = (((acc0[2]-val29)*val30*alu95)+val32+val35);
  data0_200704[alu70] = (((acc0[3]-val29)*val30*alu95)+val32+val36);
  data0_200704[alu71] = (((acc0[4]-val29)*val30*alu95)+val32+val37);
  data0_200704[alu72] = (((acc0[5]-val29)*val30*alu95)+val32+val38);
  data0_200704[alu73] = (((acc0[6]-val29)*val30*alu95)+val32+val39);
  data0_200704[alu74] = (((acc0[7]-val29)*val30*alu95)+val32+val40);
  data0_200704[alu75] = (((acc0[8]-val29)*val30*alu95)+val32+val41);
  data0_200704[alu76] = (((acc0[9]-val29)*val30*alu95)+val32+val42);
  data0_200704[alu77] = (((acc0[10]-val29)*val30*alu95)+val32+val43);
  data0_200704[alu78] = (((acc0[11]-val29)*val30*alu95)+val32+val44);
  data0_200704[alu79] = (((acc0[12]-val29)*val30*alu95)+val32+val45);
  data0_200704[alu80] = (((acc0[13]-val29)*val30*alu95)+val32+val46);
  data0_200704[alu81] = (((acc0[14]-val29)*val30*alu95)+val32+val47);
  data0_200704[alu82] = (((acc0[15]-val29)*val30*alu95)+val32+val48);
  data0_200704[alu83] = (((acc0[16]-val29)*val30*alu95)+val32+val49);
  data0_200704[alu84] = (((acc0[17]-val29)*val30*alu95)+val32+val50);
  data0_200704[alu85] = (((acc0[18]-val29)*val30*alu95)+val32+val51);
  data0_200704[alu86] = (((acc0[19]-val29)*val30*alu95)+val32+val52);
  data0_200704[alu87] = (((acc0[20]-val29)*val30*alu95)+val32+val53);
  data0_200704[alu88] = (((acc0[21]-val29)*val30*alu95)+val32+val54);
  data0_200704[alu89] = (((acc0[22]-val29)*val30*alu95)+val32+val55);
  data0_200704[alu90] = (((acc0[23]-val29)*val30*alu95)+val32+val56);
  data0_200704[alu91] = (((acc0[24]-val29)*val30*alu95)+val32+val57);
  data0_200704[alu92] = (((acc0[25]-val29)*val30*alu95)+val32+val58);
  data0_200704[alu93] = (((acc0[26]-val29)*val30*alu95)+val32+val59);
  data0_200704[alu94] = (((acc0[27]-val29)*val30*alu95)+val32+val60);
}`;

const r_28_28_16_8_4_16 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
var<workgroup> temp0: array<f32,32>;
@group(0) @binding(1)var<storage,read_write>data0_100352:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_200704:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_8192:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_128:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_128:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_128:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_128:array<f32>;
@compute @workgroup_size(8,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,1>;
  var acc1: array<f32,1>;
  var gidx0 = i32(gindex.x); /* 16 */
  var gidx1 = i32(gindex.y); /* 28 */
  var gidx2 = i32(gindex.z); /* 28 */
  var lidx0 = i32(lindex.x); /* 8 */
  var lidx1 = i32(lindex.y); /* 4 */
  var cast0 = bitcast<u32>(gidx0);
  var cast1 = bitcast<u32>(gidx1);
  var cast2 = bitcast<u32>(lidx0);
  acc0[0] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 16; Ridx0++) {
    var val0 = data1_200704[(bitcast<i32>((cast1<<1u))+(gidx2*112)+(lidx1*3136)+(Ridx0*12544))];
    var val1 = data2_8192[(lidx1+bitcast<i32>((bitcast<u32>(Ridx0)<<2u))+bitcast<i32>((cast0<<9u))+bitcast<i32>((cast2<<6u)))];
    acc0[0] = (acc0[0]+(val0*val1));
  }
  var cast3 = bitcast<i32>((cast2<<2u));
  temp0[(lidx1+cast3)] = acc0[0];
  workgroupBarrier();
  acc1[0] = 0.0f;
  for (var Ridx105 = 0; Ridx105 < 4; Ridx105++) {
    var val2 = temp0[(cast3+Ridx105)];
    acc1[0] = (acc1[0]+val2);
  }
  var alu8 = (lidx0+bitcast<i32>((cast0<<3u)));
  var val3 = data3_128[alu8];
  var val4 = data4_128[alu8];
  var val5 = data5_128[alu8];
  var val6 = data6_128[alu8];
  var alu9 = ((bool(lidx1))!=true);
  if (alu9) {
    data0_100352[(alu8+bitcast<i32>((cast1<<7u))+(gidx2*3584))] = (((acc1[0]-val3)*val4*(1/sqrt((val5+1e-05f))))+val6);
  }
}`;

const r_2_8_14_32_7_4_2_64_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  var gidx0 = i32(gindex.x); /* 14 */
  var gidx1 = i32(gindex.y); /* 8 */
  var gidx2 = i32(gindex.z); /* 2 */
  var lidx0 = i32(lindex.x); /* 32 */
  var cast0 = bitcast<i32>((bitcast<u32>(gidx0)<<2u));
  var alu0 = (gidx1*392);
  var alu1 = (gidx0<13);
  var alu2 = (0<gidx0);
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
      var alu59 = (alu0+(Ridx1*56)+cast0+(Ridx0*3136));
      var alu60 = (0<(gidx1+Ridx1));
      var val0 = select(0.0f, data1_200704[(alu59+-57)], (alu2&alu60));
      var alu61 = ((gidx2*36864)+(lidx0*576)+(Ridx0*9)+(Ridx1*3));
      var val1 = data2_73728[alu61];
      var val2 = select(0.0f, data1_200704[(alu59+-56)], alu60);
      var val3 = data2_73728[(alu61+1)];
      var val4 = select(0.0f, data1_200704[(alu59+-55)], alu60);
      var val5 = data2_73728[(alu61+2)];
      var val6 = data2_73728[(alu61+18432)];
      var val7 = data2_73728[(alu61+18433)];
      var val8 = data2_73728[(alu61+18434)];
      var val9 = select(0.0f, data1_200704[(alu59+-54)], alu60);
      var val10 = select(0.0f, data1_200704[(alu59+-53)], alu60);
      var val11 = select(0.0f, data1_200704[(alu59+-52)], (alu1&alu60));
      var val12 = select(0.0f, data1_200704[(alu59+-1)], alu2);
      var val13 = data1_200704[(alu59+1)];
      var val14 = data1_200704[(alu59+2)];
      var val15 = data1_200704[alu59];
      var val16 = data1_200704[(alu59+3)];
      var val17 = select(0.0f, data1_200704[(alu59+4)], alu1);
      var val18 = select(0.0f, data1_200704[(alu59+55)], alu2);
      var val19 = data1_200704[(alu59+56)];
      var val20 = data1_200704[(alu59+57)];
      var val21 = data1_200704[(alu59+58)];
      var val22 = data1_200704[(alu59+59)];
      var val23 = select(0.0f, data1_200704[(alu59+60)], alu1);
      var val24 = select(0.0f, data1_200704[(alu59+111)], alu2);
      var val25 = data1_200704[(alu59+112)];
      var val26 = data1_200704[(alu59+113)];
      var val27 = data1_200704[(alu59+114)];
      var val28 = data1_200704[(alu59+115)];
      var val29 = select(0.0f, data1_200704[(alu59+116)], alu1);
      var val30 = select(0.0f, data1_200704[(alu59+167)], alu2);
      var val31 = data1_200704[(alu59+168)];
      var val32 = data1_200704[(alu59+169)];
      var val33 = data1_200704[(alu59+170)];
      var val34 = data1_200704[(alu59+171)];
      var val35 = select(0.0f, data1_200704[(alu59+172)], alu1);
      var val36 = select(0.0f, data1_200704[(alu59+223)], alu2);
      var val37 = data1_200704[(alu59+224)];
      var val38 = data1_200704[(alu59+225)];
      var val39 = data1_200704[(alu59+226)];
      var val40 = data1_200704[(alu59+227)];
      var val41 = select(0.0f, data1_200704[(alu59+228)], alu1);
      var alu62 = (((gidx1*7)+Ridx1)<51);
      var val42 = select(0.0f, data1_200704[(alu59+279)], (alu2&alu62));
      var val43 = select(0.0f, data1_200704[(alu59+280)], alu62);
      var val44 = select(0.0f, data1_200704[(alu59+281)], alu62);
      var val45 = select(0.0f, data1_200704[(alu59+282)], alu62);
      var val46 = select(0.0f, data1_200704[(alu59+283)], alu62);
      var val47 = select(0.0f, data1_200704[(alu59+284)], (alu1&alu62));
      acc0[0] = (acc0[0]+(val0*val1)+(val2*val3)+(val4*val5));
      acc0[1] = (acc0[1]+(val0*val6)+(val2*val7)+(val4*val8));
      acc0[2] = (acc0[2]+(val2*val1)+(val4*val3)+(val9*val5));
      acc0[3] = (acc0[3]+(val2*val6)+(val4*val7)+(val9*val8));
      acc0[4] = (acc0[4]+(val4*val1)+(val9*val3)+(val10*val5));
      acc0[5] = (acc0[5]+(val4*val6)+(val9*val7)+(val10*val8));
      acc0[6] = (acc0[6]+(val9*val1)+(val10*val3)+(val11*val5));
      acc0[7] = (acc0[7]+(val9*val6)+(val10*val7)+(val11*val8));
      acc0[8] = (acc0[8]+(val12*val1)+(val15*val3)+(val13*val5));
      acc0[9] = (acc0[9]+(val12*val6)+(val15*val7)+(val13*val8));
      acc0[10] = (acc0[10]+(val15*val1)+(val13*val3)+(val14*val5));
      acc0[11] = (acc0[11]+(val15*val6)+(val13*val7)+(val14*val8));
      acc0[12] = (acc0[12]+(val13*val1)+(val14*val3)+(val16*val5));
      acc0[13] = (acc0[13]+(val13*val6)+(val14*val7)+(val16*val8));
      acc0[14] = (acc0[14]+(val14*val1)+(val16*val3)+(val17*val5));
      acc0[15] = (acc0[15]+(val14*val6)+(val16*val7)+(val17*val8));
      acc0[16] = (acc0[16]+(val18*val1)+(val19*val3)+(val20*val5));
      acc0[17] = (acc0[17]+(val18*val6)+(val19*val7)+(val20*val8));
      acc0[18] = (acc0[18]+(val19*val1)+(val20*val3)+(val21*val5));
      acc0[19] = (acc0[19]+(val19*val6)+(val20*val7)+(val21*val8));
      acc0[20] = (acc0[20]+(val20*val1)+(val21*val3)+(val22*val5));
      acc0[21] = (acc0[21]+(val20*val6)+(val21*val7)+(val22*val8));
      acc0[22] = (acc0[22]+(val21*val1)+(val22*val3)+(val23*val5));
      acc0[23] = (acc0[23]+(val21*val6)+(val22*val7)+(val23*val8));
      acc0[24] = (acc0[24]+(val24*val1)+(val25*val3)+(val26*val5));
      acc0[25] = (acc0[25]+(val24*val6)+(val25*val7)+(val26*val8));
      acc0[26] = (acc0[26]+(val25*val1)+(val26*val3)+(val27*val5));
      acc0[27] = (acc0[27]+(val25*val6)+(val26*val7)+(val27*val8));
      acc0[28] = (acc0[28]+(val26*val1)+(val27*val3)+(val28*val5));
      acc0[29] = (acc0[29]+(val26*val6)+(val27*val7)+(val28*val8));
      acc0[30] = (acc0[30]+(val27*val1)+(val28*val3)+(val29*val5));
      acc0[31] = (acc0[31]+(val27*val6)+(val28*val7)+(val29*val8));
      acc0[32] = (acc0[32]+(val30*val1)+(val31*val3)+(val32*val5));
      acc0[33] = (acc0[33]+(val30*val6)+(val31*val7)+(val32*val8));
      acc0[34] = (acc0[34]+(val31*val1)+(val32*val3)+(val33*val5));
      acc0[35] = (acc0[35]+(val31*val6)+(val32*val7)+(val33*val8));
      acc0[36] = (acc0[36]+(val32*val1)+(val33*val3)+(val34*val5));
      acc0[37] = (acc0[37]+(val32*val6)+(val33*val7)+(val34*val8));
      acc0[38] = (acc0[38]+(val33*val1)+(val34*val3)+(val35*val5));
      acc0[39] = (acc0[39]+(val33*val6)+(val34*val7)+(val35*val8));
      acc0[40] = (acc0[40]+(val36*val1)+(val37*val3)+(val38*val5));
      acc0[41] = (acc0[41]+(val36*val6)+(val37*val7)+(val38*val8));
      acc0[42] = (acc0[42]+(val37*val1)+(val38*val3)+(val39*val5));
      acc0[43] = (acc0[43]+(val37*val6)+(val38*val7)+(val39*val8));
      acc0[44] = (acc0[44]+(val38*val1)+(val39*val3)+(val40*val5));
      acc0[45] = (acc0[45]+(val38*val6)+(val39*val7)+(val40*val8));
      acc0[46] = (acc0[46]+(val39*val1)+(val40*val3)+(val41*val5));
      acc0[47] = (acc0[47]+(val39*val6)+(val40*val7)+(val41*val8));
      acc0[48] = (acc0[48]+(val42*val1)+(val43*val3)+(val44*val5));
      acc0[49] = (acc0[49]+(val42*val6)+(val43*val7)+(val44*val8));
      acc0[50] = (acc0[50]+(val43*val1)+(val44*val3)+(val45*val5));
      acc0[51] = (acc0[51]+(val43*val6)+(val44*val7)+(val45*val8));
      acc0[52] = (acc0[52]+(val44*val1)+(val45*val3)+(val46*val5));
      acc0[53] = (acc0[53]+(val44*val6)+(val45*val7)+(val46*val8));
      acc0[54] = (acc0[54]+(val45*val1)+(val46*val3)+(val47*val5));
      acc0[55] = (acc0[55]+(val45*val6)+(val46*val7)+(val47*val8));
    }
  }
  var alu121 = (lidx0+bitcast<i32>((bitcast<u32>(gidx2)<<6u)));
  var val48 = data3_128[alu121];
  var val49 = data4_128[alu121];
  var val50 = data5_128[alu121];
  var val51 = data6_128[alu121];
  var val52 = data7_128[alu121];
  var alu122 = (alu121+32);
  var val53 = data3_128[alu122];
  var val54 = data4_128[alu122];
  var val55 = data5_128[alu122];
  var val56 = data6_128[alu122];
  var val57 = data7_128[alu122];
  var alu123 = (cast0+alu0+(gidx2*200704)+(lidx0*3136));
  var alu124 = (1/sqrt((val50+1e-05f)));
  var alu125 = (((acc0[0]-val48)*val49*alu124)+val51);
  var alu126 = (((acc0[2]-val48)*val49*alu124)+val51);
  var alu127 = (((acc0[4]-val48)*val49*alu124)+val51);
  var alu128 = (((acc0[6]-val48)*val49*alu124)+val51);
  var alu129 = select((val52*alu125),alu125,(0.0f<alu125));
  var alu130 = select((val52*alu126),alu126,(0.0f<alu126));
  var alu131 = select((val52*alu127),alu127,(0.0f<alu127));
  var alu132 = select((val52*alu128),alu128,(0.0f<alu128));
  data0_401408[alu123] = alu129;
  data0_401408[(alu123+1)] = alu130;
  data0_401408[(alu123+2)] = alu131;
  data0_401408[(alu123+3)] = alu132;
  var alu137 = (((acc0[8]-val48)*val49*alu124)+val51);
  var alu138 = (((acc0[10]-val48)*val49*alu124)+val51);
  var alu139 = (((acc0[12]-val48)*val49*alu124)+val51);
  var alu140 = (((acc0[14]-val48)*val49*alu124)+val51);
  var alu141 = select((val52*alu137),alu137,(0.0f<alu137));
  var alu142 = select((val52*alu138),alu138,(0.0f<alu138));
  var alu143 = select((val52*alu139),alu139,(0.0f<alu139));
  var alu144 = select((val52*alu140),alu140,(0.0f<alu140));
  data0_401408[(alu123+56)] = alu141;
  data0_401408[(alu123+57)] = alu142;
  data0_401408[(alu123+58)] = alu143;
  data0_401408[(alu123+59)] = alu144;
  var alu149 = (((acc0[16]-val48)*val49*alu124)+val51);
  var alu150 = (((acc0[18]-val48)*val49*alu124)+val51);
  var alu151 = (((acc0[20]-val48)*val49*alu124)+val51);
  var alu152 = (((acc0[22]-val48)*val49*alu124)+val51);
  var alu153 = select((val52*alu149),alu149,(0.0f<alu149));
  var alu154 = select((val52*alu150),alu150,(0.0f<alu150));
  var alu155 = select((val52*alu151),alu151,(0.0f<alu151));
  var alu156 = select((val52*alu152),alu152,(0.0f<alu152));
  data0_401408[(alu123+112)] = alu153;
  data0_401408[(alu123+113)] = alu154;
  data0_401408[(alu123+114)] = alu155;
  data0_401408[(alu123+115)] = alu156;
  var alu161 = (((acc0[24]-val48)*val49*alu124)+val51);
  var alu162 = (((acc0[26]-val48)*val49*alu124)+val51);
  var alu163 = (((acc0[28]-val48)*val49*alu124)+val51);
  var alu164 = (((acc0[30]-val48)*val49*alu124)+val51);
  var alu165 = select((val52*alu161),alu161,(0.0f<alu161));
  var alu166 = select((val52*alu162),alu162,(0.0f<alu162));
  var alu167 = select((val52*alu163),alu163,(0.0f<alu163));
  var alu168 = select((val52*alu164),alu164,(0.0f<alu164));
  data0_401408[(alu123+168)] = alu165;
  data0_401408[(alu123+169)] = alu166;
  data0_401408[(alu123+170)] = alu167;
  data0_401408[(alu123+171)] = alu168;
  var alu173 = (((acc0[32]-val48)*val49*alu124)+val51);
  var alu174 = (((acc0[34]-val48)*val49*alu124)+val51);
  var alu175 = (((acc0[36]-val48)*val49*alu124)+val51);
  var alu176 = (((acc0[38]-val48)*val49*alu124)+val51);
  var alu177 = select((val52*alu173),alu173,(0.0f<alu173));
  var alu178 = select((val52*alu174),alu174,(0.0f<alu174));
  var alu179 = select((val52*alu175),alu175,(0.0f<alu175));
  var alu180 = select((val52*alu176),alu176,(0.0f<alu176));
  data0_401408[(alu123+224)] = alu177;
  data0_401408[(alu123+225)] = alu178;
  data0_401408[(alu123+226)] = alu179;
  data0_401408[(alu123+227)] = alu180;
  var alu185 = (((acc0[40]-val48)*val49*alu124)+val51);
  var alu186 = (((acc0[42]-val48)*val49*alu124)+val51);
  var alu187 = (((acc0[44]-val48)*val49*alu124)+val51);
  var alu188 = (((acc0[46]-val48)*val49*alu124)+val51);
  var alu189 = select((val52*alu185),alu185,(0.0f<alu185));
  var alu190 = select((val52*alu186),alu186,(0.0f<alu186));
  var alu191 = select((val52*alu187),alu187,(0.0f<alu187));
  var alu192 = select((val52*alu188),alu188,(0.0f<alu188));
  data0_401408[(alu123+280)] = alu189;
  data0_401408[(alu123+281)] = alu190;
  data0_401408[(alu123+282)] = alu191;
  data0_401408[(alu123+283)] = alu192;
  var alu197 = (((acc0[48]-val48)*val49*alu124)+val51);
  var alu198 = (((acc0[50]-val48)*val49*alu124)+val51);
  var alu199 = (((acc0[52]-val48)*val49*alu124)+val51);
  var alu200 = (((acc0[54]-val48)*val49*alu124)+val51);
  var alu201 = select((val52*alu197),alu197,(0.0f<alu197));
  var alu202 = select((val52*alu198),alu198,(0.0f<alu198));
  var alu203 = select((val52*alu199),alu199,(0.0f<alu199));
  var alu204 = select((val52*alu200),alu200,(0.0f<alu200));
  data0_401408[(alu123+336)] = alu201;
  data0_401408[(alu123+337)] = alu202;
  data0_401408[(alu123+338)] = alu203;
  data0_401408[(alu123+339)] = alu204;
  var alu209 = (1/sqrt((val55+1e-05f)));
  var alu210 = (((acc0[1]-val53)*val54*alu209)+val56);
  var alu211 = (((acc0[3]-val53)*val54*alu209)+val56);
  var alu212 = (((acc0[5]-val53)*val54*alu209)+val56);
  var alu213 = (((acc0[7]-val53)*val54*alu209)+val56);
  var alu214 = select((val57*alu210),alu210,(0.0f<alu210));
  var alu215 = select((val57*alu211),alu211,(0.0f<alu211));
  var alu216 = select((val57*alu212),alu212,(0.0f<alu212));
  var alu217 = select((val57*alu213),alu213,(0.0f<alu213));
  data0_401408[(alu123+100352)] = alu214;
  data0_401408[(alu123+100353)] = alu215;
  data0_401408[(alu123+100354)] = alu216;
  data0_401408[(alu123+100355)] = alu217;
  var alu222 = (((acc0[9]-val53)*val54*alu209)+val56);
  var alu223 = (((acc0[11]-val53)*val54*alu209)+val56);
  var alu224 = (((acc0[13]-val53)*val54*alu209)+val56);
  var alu225 = (((acc0[15]-val53)*val54*alu209)+val56);
  var alu226 = select((val57*alu222),alu222,(0.0f<alu222));
  var alu227 = select((val57*alu223),alu223,(0.0f<alu223));
  var alu228 = select((val57*alu224),alu224,(0.0f<alu224));
  var alu229 = select((val57*alu225),alu225,(0.0f<alu225));
  data0_401408[(alu123+100408)] = alu226;
  data0_401408[(alu123+100409)] = alu227;
  data0_401408[(alu123+100410)] = alu228;
  data0_401408[(alu123+100411)] = alu229;
  var alu234 = (((acc0[17]-val53)*val54*alu209)+val56);
  var alu235 = (((acc0[19]-val53)*val54*alu209)+val56);
  var alu236 = (((acc0[21]-val53)*val54*alu209)+val56);
  var alu237 = (((acc0[23]-val53)*val54*alu209)+val56);
  var alu238 = select((val57*alu234),alu234,(0.0f<alu234));
  var alu239 = select((val57*alu235),alu235,(0.0f<alu235));
  var alu240 = select((val57*alu236),alu236,(0.0f<alu236));
  var alu241 = select((val57*alu237),alu237,(0.0f<alu237));
  data0_401408[(alu123+100464)] = alu238;
  data0_401408[(alu123+100465)] = alu239;
  data0_401408[(alu123+100466)] = alu240;
  data0_401408[(alu123+100467)] = alu241;
  var alu246 = (((acc0[25]-val53)*val54*alu209)+val56);
  var alu247 = (((acc0[27]-val53)*val54*alu209)+val56);
  var alu248 = (((acc0[29]-val53)*val54*alu209)+val56);
  var alu249 = (((acc0[31]-val53)*val54*alu209)+val56);
  var alu250 = select((val57*alu246),alu246,(0.0f<alu246));
  var alu251 = select((val57*alu247),alu247,(0.0f<alu247));
  var alu252 = select((val57*alu248),alu248,(0.0f<alu248));
  var alu253 = select((val57*alu249),alu249,(0.0f<alu249));
  data0_401408[(alu123+100520)] = alu250;
  data0_401408[(alu123+100521)] = alu251;
  data0_401408[(alu123+100522)] = alu252;
  data0_401408[(alu123+100523)] = alu253;
  var alu258 = (((acc0[33]-val53)*val54*alu209)+val56);
  var alu259 = (((acc0[35]-val53)*val54*alu209)+val56);
  var alu260 = (((acc0[37]-val53)*val54*alu209)+val56);
  var alu261 = (((acc0[39]-val53)*val54*alu209)+val56);
  var alu262 = select((val57*alu258),alu258,(0.0f<alu258));
  var alu263 = select((val57*alu259),alu259,(0.0f<alu259));
  var alu264 = select((val57*alu260),alu260,(0.0f<alu260));
  var alu265 = select((val57*alu261),alu261,(0.0f<alu261));
  data0_401408[(alu123+100576)] = alu262;
  data0_401408[(alu123+100577)] = alu263;
  data0_401408[(alu123+100578)] = alu264;
  data0_401408[(alu123+100579)] = alu265;
  var alu270 = (((acc0[41]-val53)*val54*alu209)+val56);
  var alu271 = (((acc0[43]-val53)*val54*alu209)+val56);
  var alu272 = (((acc0[45]-val53)*val54*alu209)+val56);
  var alu273 = (((acc0[47]-val53)*val54*alu209)+val56);
  var alu274 = select((val57*alu270),alu270,(0.0f<alu270));
  var alu275 = select((val57*alu271),alu271,(0.0f<alu271));
  var alu276 = select((val57*alu272),alu272,(0.0f<alu272));
  var alu277 = select((val57*alu273),alu273,(0.0f<alu273));
  data0_401408[(alu123+100632)] = alu274;
  data0_401408[(alu123+100633)] = alu275;
  data0_401408[(alu123+100634)] = alu276;
  data0_401408[(alu123+100635)] = alu277;
  var alu282 = (((acc0[49]-val53)*val54*alu209)+val56);
  var alu283 = (((acc0[51]-val53)*val54*alu209)+val56);
  var alu284 = (((acc0[53]-val53)*val54*alu209)+val56);
  var alu285 = (((acc0[55]-val53)*val54*alu209)+val56);
  var alu286 = select((val57*alu282),alu282,(0.0f<alu282));
  var alu287 = select((val57*alu283),alu283,(0.0f<alu283));
  var alu288 = select((val57*alu284),alu284,(0.0f<alu284));
  var alu289 = select((val57*alu285),alu285,(0.0f<alu285));
  data0_401408[(alu123+100688)] = alu286;
  data0_401408[(alu123+100689)] = alu287;
  data0_401408[(alu123+100690)] = alu288;
  data0_401408[(alu123+100691)] = alu289;
}`;

const r_28_4_2_16_4_7_128_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_100352:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_401408:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_147456:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_128:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_128:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_128:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_128:array<f32>;
@compute @workgroup_size(16,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,7>;
  var gidx0 = i32(gindex.x); /* 2 */
  var gidx1 = i32(gindex.y); /* 4 */
  var gidx2 = i32(gindex.z); /* 28 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 4 */
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 128; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu7 = (bitcast<i32>((bitcast<u32>(gidx2)<<1u))+Ridx1+(Ridx0*56)+-1);
      var alu8 = select(0,1,(alu7<0));
      var alu9 = (0<(gidx2+Ridx1));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu10 = ((gidx1*14)+Ridx2);
        var alu11 = (alu10+(gidx2*112)+(Ridx1*56)+(Ridx0*3136));
        var alu12 = (alu11+-57);
        var alu13 = select(0,63,(alu12<0));
        var val0 = select(0.0f, data1_401408[(alu10+((alu7-(56*(((alu7*9363)>>19u)+alu8)))*56)+(((((alu12+alu13)>>6u)*2675)>>17u)*3136)+-1)], ((0<(gidx1+Ridx2))&alu9));
        var val1 = data2_147456[((gidx0*73728)+(lidx1*18432)+(lidx0*1152)+(Ridx1*3)+Ridx2+(Ridx0*9))];
        var val2 = select(0.0f, data1_401408[(alu11+-55)], alu9);
        var val3 = select(0.0f, data1_401408[(alu11+-53)], alu9);
        var val4 = select(0.0f, data1_401408[(alu11+-51)], alu9);
        var val5 = select(0.0f, data1_401408[(alu11+-49)], alu9);
        var val6 = select(0.0f, data1_401408[(alu11+-47)], alu9);
        var val7 = select(0.0f, data1_401408[(alu11+-45)], alu9);
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
  var alu24 = (lidx0+bitcast<i32>((bitcast<u32>(gidx0)<<6u))+bitcast<i32>((bitcast<u32>(lidx1)<<4u)));
  var val8 = data3_128[alu24];
  var val9 = data4_128[alu24];
  var val10 = data5_128[alu24];
  var val11 = data6_128[alu24];
  var alu25 = (alu24+(gidx1*896)+(gidx2*3584));
  var alu26 = (1/sqrt((val10+1e-05f)));
  data0_100352[alu25] = (((acc0[0]-val8)*val9*alu26)+val11);
  data0_100352[(alu25+128)] = (((acc0[1]-val8)*val9*alu26)+val11);
  data0_100352[(alu25+256)] = (((acc0[2]-val8)*val9*alu26)+val11);
  data0_100352[(alu25+384)] = (((acc0[3]-val8)*val9*alu26)+val11);
  data0_100352[(alu25+512)] = (((acc0[4]-val8)*val9*alu26)+val11);
  data0_100352[(alu25+640)] = (((acc0[5]-val8)*val9*alu26)+val11);
  data0_100352[(alu25+768)] = (((acc0[6]-val8)*val9*alu26)+val11);
}`;

const E_128_98_8 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_100352:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_100352:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_100352:array<f32>;
@compute @workgroup_size(8) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 98 */
  var gidx1 = i32(gindex.y); /* 128 */
  var lidx0 = i32(lindex.x); /* 8 */
  var cast0 = bitcast<u32>(gidx0);
  var alu0 = (gidx1+bitcast<i32>((cast0<<10u))+bitcast<i32>((bitcast<u32>(lidx0)<<7u)));
  var val0 = data1_100352[alu0];
  var val1 = data2_100352[alu0];
  data0_100352[(lidx0+bitcast<i32>((cast0<<3u))+(gidx1*784))] = (val0+val1);
}`;

const E_128_392_2 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_100352:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_100352:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_128:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_128:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_128:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_128:array<f32>;
@compute @workgroup_size(1) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 392 */
  var gidx1 = i32(gindex.y); /* 128 */
  var alu0 = (bitcast<i32>((bitcast<u32>(gidx0)<<1u))+(gidx1*784));
  var val0 = data1_100352[alu0];
  var val1 = data2_128[gidx1];
  var val2 = data3_128[gidx1];
  var val3 = data4_128[gidx1];
  var val4 = data5_128[gidx1];
  var alu1 = (alu0+1);
  var val5 = data1_100352[alu1];
  var alu2 = (1/sqrt((val3+1e-05f)));
  data0_100352[alu0] = (((val0-val1)*val2*alu2)+val4);
  data0_100352[alu1] = (((val5-val1)*val2*alu2)+val4);
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

const r_14_14_16_16_128 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  var acc0: array<f32,1>;
  var gidx0 = i32(gindex.x); /* 16 */
  var gidx1 = i32(gindex.y); /* 14 */
  var gidx2 = i32(gindex.z); /* 14 */
  var lidx0 = i32(lindex.x); /* 16 */
  var cast0 = bitcast<u32>(gidx0);
  var cast1 = bitcast<u32>(gidx1);
  acc0[0] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 128; Ridx0++) {
    var val0 = data1_100352[(bitcast<i32>((cast1<<1u))+(gidx2*56)+(Ridx0*784))];
    var val1 = data2_32768[(bitcast<i32>((cast0<<11u))+bitcast<i32>((bitcast<u32>(lidx0)<<7u))+Ridx0)];
    acc0[0] = (acc0[0]+(val0*val1));
  }
  var alu3 = (lidx0+bitcast<i32>((cast0<<4u)));
  var val2 = data3_256[alu3];
  var val3 = data4_256[alu3];
  var val4 = data5_256[alu3];
  var val5 = data6_256[alu3];
  data0_50176[(alu3+bitcast<i32>((cast1<<8u))+(gidx2*3584))] = (((acc0[0]-val2)*val3*(1/sqrt((val4+1e-05f))))+val5);
}`;

const r_4_7_32_4_7_4_2_128_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
@compute @workgroup_size(32,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,56>;
  var gidx0 = i32(gindex.x); /* 7 */
  var gidx1 = i32(gindex.y); /* 4 */
  var lidx0 = i32(lindex.x); /* 32 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (lidx1+bitcast<i32>((bitcast<u32>(gidx0)<<2u)));
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
    for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
      var alu57 = (alu0+Ridx2);
      var alu58 = (alu57+(Ridx0*784));
      var alu59 = ((0<(gidx0+lidx1+Ridx2))&(alu57<29));
      var val0 = select(0.0f, data1_100352[(alu58+-1)], alu59);
      var alu60 = ((gidx1*73728)+(lidx0*1152)+(Ridx0*9)+Ridx2);
      var val1 = data2_294912[(alu60+3)];
      var val2 = select(0.0f, data1_100352[(alu58+27)], alu59);
      var val3 = data2_294912[(alu60+6)];
      var val4 = data2_294912[(alu60+36867)];
      var val5 = data2_294912[(alu60+36870)];
      var val6 = select(0.0f, data1_100352[(alu58+167)], alu59);
      var val7 = data2_294912[alu60];
      var val8 = select(0.0f, data1_100352[(alu58+195)], alu59);
      var val9 = select(0.0f, data1_100352[(alu58+223)], alu59);
      var val10 = data2_294912[(alu60+36864)];
      var val11 = select(0.0f, data1_100352[(alu58+363)], alu59);
      var val12 = select(0.0f, data1_100352[(alu58+391)], alu59);
      var val13 = select(0.0f, data1_100352[(alu58+419)], alu59);
      var val14 = select(0.0f, data1_100352[(alu58+55)], alu59);
      var val15 = select(0.0f, data1_100352[(alu58+559)], alu59);
      var val16 = select(0.0f, data1_100352[(alu58+587)], alu59);
      var val17 = select(0.0f, data1_100352[(alu58+615)], alu59);
      var val18 = select(0.0f, data1_100352[(alu58+251)], alu59);
      var val19 = select(0.0f, data1_100352[(alu58+447)], alu59);
      var val20 = select(0.0f, data1_100352[(alu58+643)], alu59);
      var val21 = select(0.0f, data1_100352[(alu58+83)], alu59);
      var val22 = select(0.0f, data1_100352[(alu58+279)], alu59);
      var val23 = select(0.0f, data1_100352[(alu58+475)], alu59);
      var val24 = select(0.0f, data1_100352[(alu58+671)], alu59);
      var val25 = select(0.0f, data1_100352[(alu58+111)], alu59);
      var val26 = select(0.0f, data1_100352[(alu58+307)], alu59);
      var val27 = select(0.0f, data1_100352[(alu58+503)], alu59);
      var val28 = select(0.0f, data1_100352[(alu58+699)], alu59);
      var val29 = select(0.0f, data1_100352[(alu58+139)], alu59);
      var val30 = select(0.0f, data1_100352[(alu58+335)], alu59);
      var val31 = select(0.0f, data1_100352[(alu58+531)], alu59);
      var val32 = select(0.0f, data1_100352[(alu58+727)], alu59);
      var val33 = select(0.0f, data1_100352[(alu58+755)], alu59);
      acc0[0] = (acc0[0]+(val0*val1)+(val2*val3));
      acc0[1] = (acc0[1]+(val0*val4)+(val2*val5));
      acc0[2] = (acc0[2]+(val6*val7)+(val8*val1)+(val9*val3));
      acc0[3] = (acc0[3]+(val6*val10)+(val8*val4)+(val9*val5));
      acc0[4] = (acc0[4]+(val11*val7)+(val12*val1)+(val13*val3));
      acc0[5] = (acc0[5]+(val11*val10)+(val12*val4)+(val13*val5));
      acc0[6] = (acc0[6]+(val15*val7)+(val16*val1)+(val17*val3));
      acc0[7] = (acc0[7]+(val15*val10)+(val16*val4)+(val17*val5));
      acc0[8] = (acc0[8]+(val0*val7)+(val2*val1)+(val14*val3));
      acc0[9] = (acc0[9]+(val0*val10)+(val2*val4)+(val14*val5));
      acc0[10] = (acc0[10]+(val8*val7)+(val9*val1)+(val18*val3));
      acc0[11] = (acc0[11]+(val8*val10)+(val9*val4)+(val18*val5));
      acc0[12] = (acc0[12]+(val12*val7)+(val13*val1)+(val19*val3));
      acc0[13] = (acc0[13]+(val12*val10)+(val13*val4)+(val19*val5));
      acc0[14] = (acc0[14]+(val16*val7)+(val17*val1)+(val20*val3));
      acc0[15] = (acc0[15]+(val16*val10)+(val17*val4)+(val20*val5));
      acc0[16] = (acc0[16]+(val2*val7)+(val14*val1)+(val21*val3));
      acc0[17] = (acc0[17]+(val2*val10)+(val14*val4)+(val21*val5));
      acc0[18] = (acc0[18]+(val9*val7)+(val18*val1)+(val22*val3));
      acc0[19] = (acc0[19]+(val9*val10)+(val18*val4)+(val22*val5));
      acc0[20] = (acc0[20]+(val13*val7)+(val19*val1)+(val23*val3));
      acc0[21] = (acc0[21]+(val13*val10)+(val19*val4)+(val23*val5));
      acc0[22] = (acc0[22]+(val17*val7)+(val20*val1)+(val24*val3));
      acc0[23] = (acc0[23]+(val17*val10)+(val20*val4)+(val24*val5));
      acc0[24] = (acc0[24]+(val14*val7)+(val21*val1)+(val25*val3));
      acc0[25] = (acc0[25]+(val14*val10)+(val21*val4)+(val25*val5));
      acc0[26] = (acc0[26]+(val18*val7)+(val22*val1)+(val26*val3));
      acc0[27] = (acc0[27]+(val18*val10)+(val22*val4)+(val26*val5));
      acc0[28] = (acc0[28]+(val19*val7)+(val23*val1)+(val27*val3));
      acc0[29] = (acc0[29]+(val19*val10)+(val23*val4)+(val27*val5));
      acc0[30] = (acc0[30]+(val20*val7)+(val24*val1)+(val28*val3));
      acc0[31] = (acc0[31]+(val20*val10)+(val24*val4)+(val28*val5));
      acc0[32] = (acc0[32]+(val21*val7)+(val25*val1)+(val29*val3));
      acc0[33] = (acc0[33]+(val21*val10)+(val25*val4)+(val29*val5));
      acc0[34] = (acc0[34]+(val22*val7)+(val26*val1)+(val30*val3));
      acc0[35] = (acc0[35]+(val22*val10)+(val26*val4)+(val30*val5));
      acc0[36] = (acc0[36]+(val23*val7)+(val27*val1)+(val31*val3));
      acc0[37] = (acc0[37]+(val23*val10)+(val27*val4)+(val31*val5));
      acc0[38] = (acc0[38]+(val24*val7)+(val28*val1)+(val32*val3));
      acc0[39] = (acc0[39]+(val24*val10)+(val28*val4)+(val32*val5));
      acc0[40] = (acc0[40]+(val25*val7)+(val29*val1)+(val6*val3));
      acc0[41] = (acc0[41]+(val25*val10)+(val29*val4)+(val6*val5));
      acc0[42] = (acc0[42]+(val26*val7)+(val30*val1)+(val11*val3));
      acc0[43] = (acc0[43]+(val26*val10)+(val30*val4)+(val11*val5));
      acc0[44] = (acc0[44]+(val27*val7)+(val31*val1)+(val15*val3));
      acc0[45] = (acc0[45]+(val27*val10)+(val31*val4)+(val15*val5));
      acc0[46] = (acc0[46]+(val28*val7)+(val32*val1)+(val33*val3));
      acc0[47] = (acc0[47]+(val28*val10)+(val32*val4)+(val33*val5));
      acc0[48] = (acc0[48]+(val29*val7)+(val6*val1)+(val8*val3));
      acc0[49] = (acc0[49]+(val29*val10)+(val6*val4)+(val8*val5));
      acc0[50] = (acc0[50]+(val30*val7)+(val11*val1)+(val12*val3));
      acc0[51] = (acc0[51]+(val30*val10)+(val11*val4)+(val12*val5));
      acc0[52] = (acc0[52]+(val31*val7)+(val15*val1)+(val16*val3));
      acc0[53] = (acc0[53]+(val31*val10)+(val15*val4)+(val16*val5));
      acc0[54] = (acc0[54]+(val32*val7)+(val33*val1));
      acc0[55] = (acc0[55]+(val32*val10)+(val33*val4));
    }
  }
  var alu119 = (lidx0+bitcast<i32>((bitcast<u32>(gidx1)<<6u)));
  var val34 = data3_256[alu119];
  var val35 = data4_256[alu119];
  var val36 = data5_256[alu119];
  var val37 = data6_256[alu119];
  var val38 = data7_256[alu119];
  var alu120 = (alu119+32);
  var val39 = data3_256[alu120];
  var val40 = data4_256[alu120];
  var val41 = data5_256[alu120];
  var val42 = data6_256[alu120];
  var val43 = data7_256[alu120];
  var alu121 = (alu0+(gidx1*50176)+(lidx0*784));
  var alu122 = (1/sqrt((val36+1e-05f)));
  var alu123 = (1/sqrt((val41+1e-05f)));
  var alu124 = (((acc0[0]-val34)*val35*alu122)+val37);
  var alu125 = (((acc0[1]-val39)*val40*alu123)+val42);
  var alu126 = (((acc0[2]-val34)*val35*alu122)+val37);
  var alu127 = (((acc0[3]-val39)*val40*alu123)+val42);
  var alu128 = (((acc0[4]-val34)*val35*alu122)+val37);
  var alu129 = (((acc0[5]-val39)*val40*alu123)+val42);
  var alu130 = (((acc0[6]-val34)*val35*alu122)+val37);
  var alu131 = (((acc0[7]-val39)*val40*alu123)+val42);
  var alu132 = (((acc0[8]-val34)*val35*alu122)+val37);
  var alu133 = (((acc0[9]-val39)*val40*alu123)+val42);
  var alu134 = (((acc0[10]-val34)*val35*alu122)+val37);
  var alu135 = (((acc0[11]-val39)*val40*alu123)+val42);
  var alu136 = (((acc0[12]-val34)*val35*alu122)+val37);
  var alu137 = (((acc0[13]-val39)*val40*alu123)+val42);
  var alu138 = (((acc0[14]-val34)*val35*alu122)+val37);
  var alu139 = (((acc0[15]-val39)*val40*alu123)+val42);
  var alu140 = (((acc0[16]-val34)*val35*alu122)+val37);
  var alu141 = (((acc0[17]-val39)*val40*alu123)+val42);
  var alu142 = (((acc0[18]-val34)*val35*alu122)+val37);
  var alu143 = (((acc0[19]-val39)*val40*alu123)+val42);
  var alu144 = (((acc0[20]-val34)*val35*alu122)+val37);
  var alu145 = (((acc0[21]-val39)*val40*alu123)+val42);
  var alu146 = (((acc0[22]-val34)*val35*alu122)+val37);
  var alu147 = (((acc0[23]-val39)*val40*alu123)+val42);
  var alu148 = (((acc0[24]-val34)*val35*alu122)+val37);
  var alu149 = (((acc0[25]-val39)*val40*alu123)+val42);
  var alu150 = (((acc0[26]-val34)*val35*alu122)+val37);
  var alu151 = (((acc0[27]-val39)*val40*alu123)+val42);
  var alu152 = (((acc0[28]-val34)*val35*alu122)+val37);
  var alu153 = (((acc0[29]-val39)*val40*alu123)+val42);
  var alu154 = (((acc0[30]-val34)*val35*alu122)+val37);
  var alu155 = (((acc0[31]-val39)*val40*alu123)+val42);
  var alu156 = (((acc0[32]-val34)*val35*alu122)+val37);
  var alu157 = (((acc0[33]-val39)*val40*alu123)+val42);
  var alu158 = (((acc0[34]-val34)*val35*alu122)+val37);
  var alu159 = (((acc0[35]-val39)*val40*alu123)+val42);
  var alu160 = (((acc0[36]-val34)*val35*alu122)+val37);
  var alu161 = (((acc0[37]-val39)*val40*alu123)+val42);
  var alu162 = (((acc0[38]-val34)*val35*alu122)+val37);
  var alu163 = (((acc0[39]-val39)*val40*alu123)+val42);
  var alu164 = (((acc0[40]-val34)*val35*alu122)+val37);
  var alu165 = (((acc0[41]-val39)*val40*alu123)+val42);
  var alu166 = (((acc0[42]-val34)*val35*alu122)+val37);
  var alu167 = (((acc0[43]-val39)*val40*alu123)+val42);
  var alu168 = (((acc0[44]-val34)*val35*alu122)+val37);
  var alu169 = (((acc0[45]-val39)*val40*alu123)+val42);
  var alu170 = (((acc0[46]-val34)*val35*alu122)+val37);
  var alu171 = (((acc0[47]-val39)*val40*alu123)+val42);
  var alu172 = (((acc0[48]-val34)*val35*alu122)+val37);
  var alu173 = (((acc0[49]-val39)*val40*alu123)+val42);
  var alu174 = (((acc0[50]-val34)*val35*alu122)+val37);
  var alu175 = (((acc0[51]-val39)*val40*alu123)+val42);
  var alu176 = (((acc0[52]-val34)*val35*alu122)+val37);
  var alu177 = (((acc0[53]-val39)*val40*alu123)+val42);
  var alu178 = (((acc0[54]-val34)*val35*alu122)+val37);
  var alu179 = (((acc0[55]-val39)*val40*alu123)+val42);
  var alu180 = select((val38*alu124),alu124,(0.0f<alu124));
  var alu181 = select((val43*alu125),alu125,(0.0f<alu125));
  var alu182 = select((val38*alu126),alu126,(0.0f<alu126));
  var alu183 = select((val43*alu127),alu127,(0.0f<alu127));
  var alu184 = select((val38*alu128),alu128,(0.0f<alu128));
  var alu185 = select((val43*alu129),alu129,(0.0f<alu129));
  var alu186 = select((val38*alu130),alu130,(0.0f<alu130));
  var alu187 = select((val43*alu131),alu131,(0.0f<alu131));
  var alu188 = select((val38*alu132),alu132,(0.0f<alu132));
  var alu189 = select((val43*alu133),alu133,(0.0f<alu133));
  var alu190 = select((val38*alu134),alu134,(0.0f<alu134));
  var alu191 = select((val43*alu135),alu135,(0.0f<alu135));
  var alu192 = select((val38*alu136),alu136,(0.0f<alu136));
  var alu193 = select((val43*alu137),alu137,(0.0f<alu137));
  var alu194 = select((val38*alu138),alu138,(0.0f<alu138));
  var alu195 = select((val43*alu139),alu139,(0.0f<alu139));
  var alu196 = select((val38*alu140),alu140,(0.0f<alu140));
  var alu197 = select((val43*alu141),alu141,(0.0f<alu141));
  var alu198 = select((val38*alu142),alu142,(0.0f<alu142));
  var alu199 = select((val43*alu143),alu143,(0.0f<alu143));
  var alu200 = select((val38*alu144),alu144,(0.0f<alu144));
  var alu201 = select((val43*alu145),alu145,(0.0f<alu145));
  var alu202 = select((val38*alu146),alu146,(0.0f<alu146));
  var alu203 = select((val43*alu147),alu147,(0.0f<alu147));
  var alu204 = select((val38*alu148),alu148,(0.0f<alu148));
  var alu205 = select((val43*alu149),alu149,(0.0f<alu149));
  var alu206 = select((val38*alu150),alu150,(0.0f<alu150));
  var alu207 = select((val43*alu151),alu151,(0.0f<alu151));
  var alu208 = select((val38*alu152),alu152,(0.0f<alu152));
  var alu209 = select((val43*alu153),alu153,(0.0f<alu153));
  var alu210 = select((val38*alu154),alu154,(0.0f<alu154));
  var alu211 = select((val43*alu155),alu155,(0.0f<alu155));
  var alu212 = select((val38*alu156),alu156,(0.0f<alu156));
  var alu213 = select((val43*alu157),alu157,(0.0f<alu157));
  var alu214 = select((val38*alu158),alu158,(0.0f<alu158));
  var alu215 = select((val43*alu159),alu159,(0.0f<alu159));
  var alu216 = select((val38*alu160),alu160,(0.0f<alu160));
  var alu217 = select((val43*alu161),alu161,(0.0f<alu161));
  var alu218 = select((val38*alu162),alu162,(0.0f<alu162));
  var alu219 = select((val43*alu163),alu163,(0.0f<alu163));
  var alu220 = select((val38*alu164),alu164,(0.0f<alu164));
  var alu221 = select((val43*alu165),alu165,(0.0f<alu165));
  var alu222 = select((val38*alu166),alu166,(0.0f<alu166));
  var alu223 = select((val43*alu167),alu167,(0.0f<alu167));
  var alu224 = select((val38*alu168),alu168,(0.0f<alu168));
  var alu225 = select((val43*alu169),alu169,(0.0f<alu169));
  var alu226 = select((val38*alu170),alu170,(0.0f<alu170));
  var alu227 = select((val43*alu171),alu171,(0.0f<alu171));
  var alu228 = select((val38*alu172),alu172,(0.0f<alu172));
  var alu229 = select((val43*alu173),alu173,(0.0f<alu173));
  var alu230 = select((val38*alu174),alu174,(0.0f<alu174));
  var alu231 = select((val43*alu175),alu175,(0.0f<alu175));
  var alu232 = select((val38*alu176),alu176,(0.0f<alu176));
  var alu233 = select((val43*alu177),alu177,(0.0f<alu177));
  var alu234 = select((val38*alu178),alu178,(0.0f<alu178));
  var alu235 = select((val43*alu179),alu179,(0.0f<alu179));
  data0_200704[alu121] = alu180;
  data0_200704[(alu121+28)] = alu188;
  data0_200704[(alu121+56)] = alu196;
  data0_200704[(alu121+84)] = alu204;
  data0_200704[(alu121+112)] = alu212;
  data0_200704[(alu121+140)] = alu220;
  data0_200704[(alu121+168)] = alu228;
  data0_200704[(alu121+196)] = alu182;
  data0_200704[(alu121+224)] = alu190;
  data0_200704[(alu121+252)] = alu198;
  data0_200704[(alu121+280)] = alu206;
  data0_200704[(alu121+308)] = alu214;
  data0_200704[(alu121+336)] = alu222;
  data0_200704[(alu121+364)] = alu230;
  data0_200704[(alu121+392)] = alu184;
  data0_200704[(alu121+420)] = alu192;
  data0_200704[(alu121+448)] = alu200;
  data0_200704[(alu121+476)] = alu208;
  data0_200704[(alu121+504)] = alu216;
  data0_200704[(alu121+532)] = alu224;
  data0_200704[(alu121+560)] = alu232;
  data0_200704[(alu121+588)] = alu186;
  data0_200704[(alu121+616)] = alu194;
  data0_200704[(alu121+644)] = alu202;
  data0_200704[(alu121+672)] = alu210;
  data0_200704[(alu121+700)] = alu218;
  data0_200704[(alu121+728)] = alu226;
  data0_200704[(alu121+756)] = alu234;
  data0_200704[(alu121+25088)] = alu181;
  data0_200704[(alu121+25116)] = alu189;
  data0_200704[(alu121+25144)] = alu197;
  data0_200704[(alu121+25172)] = alu205;
  data0_200704[(alu121+25200)] = alu213;
  data0_200704[(alu121+25228)] = alu221;
  data0_200704[(alu121+25256)] = alu229;
  data0_200704[(alu121+25284)] = alu183;
  data0_200704[(alu121+25312)] = alu191;
  data0_200704[(alu121+25340)] = alu199;
  data0_200704[(alu121+25368)] = alu207;
  data0_200704[(alu121+25396)] = alu215;
  data0_200704[(alu121+25424)] = alu223;
  data0_200704[(alu121+25452)] = alu231;
  data0_200704[(alu121+25480)] = alu185;
  data0_200704[(alu121+25508)] = alu193;
  data0_200704[(alu121+25536)] = alu201;
  data0_200704[(alu121+25564)] = alu209;
  data0_200704[(alu121+25592)] = alu217;
  data0_200704[(alu121+25620)] = alu225;
  data0_200704[(alu121+25648)] = alu233;
  data0_200704[(alu121+25676)] = alu187;
  data0_200704[(alu121+25704)] = alu195;
  data0_200704[(alu121+25732)] = alu203;
  data0_200704[(alu121+25760)] = alu211;
  data0_200704[(alu121+25788)] = alu219;
  data0_200704[(alu121+25816)] = alu227;
  data0_200704[(alu121+25844)] = alu235;
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
  var alu0 = (0<gidx1);
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
      var alu15 = ((gidx1*56)+Ridx2+(Ridx0*784));
      var alu16 = (0<Ridx2);
      var val0 = select(0.0f, data1_200704[(alu15+-29)], (alu16&alu0));
      var alu17 = ((gidx0*36864)+(lidx0*2304)+(Ridx0*9)+Ridx2);
      var val1 = data2_589824[(alu17+3)];
      var val2 = data2_589824[alu17];
      var val3 = select(0.0f, data1_200704[(alu15+-25)], alu0);
      var val4 = select(0.0f, data1_200704[(alu15+-1)], alu16);
      var val5 = data1_200704[(alu15+3)];
      var val6 = select(0.0f, data1_200704[(alu15+27)], alu16);
      var val7 = data2_589824[(alu17+6)];
      var val8 = select(0.0f, data1_200704[(alu15+-27)], alu0);
      var val9 = data1_200704[(alu15+1)];
      var val10 = data1_200704[(alu15+29)];
      var val11 = data1_200704[(alu15+31)];
      var val12 = select(0.0f, data1_200704[(alu15+-23)], alu0);
      var val13 = select(0.0f, data1_200704[(alu15+-21)], alu0);
      var val14 = select(0.0f, data1_200704[(alu15+-19)], alu0);
      var val15 = data1_200704[(alu15+5)];
      var val16 = data1_200704[(alu15+7)];
      var val17 = data1_200704[(alu15+9)];
      var val18 = data1_200704[(alu15+33)];
      var val19 = data1_200704[(alu15+35)];
      var val20 = select(0.0f, data1_200704[(alu15+-15)], alu0);
      var val21 = data1_200704[(alu15+13)];
      var val22 = data1_200704[(alu15+37)];
      var val23 = select(0.0f, data1_200704[(alu15+-17)], alu0);
      var val24 = data1_200704[(alu15+11)];
      var val25 = data1_200704[(alu15+39)];
      var val26 = data1_200704[(alu15+41)];
      var val27 = select(0.0f, data1_200704[(alu15+-13)], alu0);
      var val28 = select(0.0f, data1_200704[(alu15+-11)], alu0);
      var val29 = select(0.0f, data1_200704[(alu15+-9)], alu0);
      var val30 = data1_200704[(alu15+17)];
      var val31 = data1_200704[(alu15+45)];
      var val32 = data1_200704[(alu15+19)];
      var val33 = data1_200704[(alu15+47)];
      var val34 = select(0.0f, data1_200704[(alu15+-7)], alu0);
      var val35 = data1_200704[(alu15+21)];
      var val36 = data1_200704[(alu15+49)];
      var val37 = select(0.0f, data1_200704[(alu15+-5)], alu0);
      var val38 = select(0.0f, data1_200704[(alu15+-3)], alu0);
      var val39 = data1_200704[(alu15+15)];
      var val40 = data1_200704[(alu15+23)];
      var val41 = data1_200704[(alu15+51)];
      var val42 = data1_200704[(alu15+25)];
      var val43 = data1_200704[(alu15+43)];
      var val44 = data1_200704[(alu15+53)];
      acc0[0] = (acc0[0]+(val0*val2)+(val4*val1)+(val6*val7));
      acc0[1] = (acc0[1]+(val8*val2)+(val9*val1)+(val10*val7));
      acc0[2] = (acc0[2]+(val3*val2)+(val5*val1)+(val11*val7));
      acc0[3] = (acc0[3]+(val12*val2)+(val15*val1)+(val18*val7));
      acc0[4] = (acc0[4]+(val13*val2)+(val16*val1)+(val19*val7));
      acc0[5] = (acc0[5]+(val14*val2)+(val17*val1)+(val22*val7));
      acc0[6] = (acc0[6]+(val23*val2)+(val24*val1)+(val25*val7));
      acc0[7] = (acc0[7]+(val20*val2)+(val21*val1)+(val26*val7));
      acc0[8] = (acc0[8]+(val27*val2)+(val39*val1)+(val43*val7));
      acc0[9] = (acc0[9]+(val28*val2)+(val30*val1)+(val31*val7));
      acc0[10] = (acc0[10]+(val29*val2)+(val32*val1)+(val33*val7));
      acc0[11] = (acc0[11]+(val34*val2)+(val35*val1)+(val36*val7));
      acc0[12] = (acc0[12]+(val37*val2)+(val40*val1)+(val41*val7));
      acc0[13] = (acc0[13]+(val38*val2)+(val42*val1)+(val44*val7));
    }
  }
  var alu34 = (lidx0+bitcast<i32>((bitcast<u32>(gidx0)<<4u)));
  var val45 = data3_256[alu34];
  var val46 = data4_256[alu34];
  var val47 = data5_256[alu34];
  var val48 = data6_256[alu34];
  var alu35 = (alu34+(gidx1*3584));
  var alu36 = (1/sqrt((val47+1e-05f)));
  data0_50176[alu35] = (((acc0[0]-val45)*val46*alu36)+val48);
  data0_50176[(alu35+256)] = (((acc0[1]-val45)*val46*alu36)+val48);
  data0_50176[(alu35+512)] = (((acc0[2]-val45)*val46*alu36)+val48);
  data0_50176[(alu35+768)] = (((acc0[3]-val45)*val46*alu36)+val48);
  data0_50176[(alu35+1024)] = (((acc0[4]-val45)*val46*alu36)+val48);
  data0_50176[(alu35+1280)] = (((acc0[5]-val45)*val46*alu36)+val48);
  data0_50176[(alu35+1536)] = (((acc0[6]-val45)*val46*alu36)+val48);
  data0_50176[(alu35+1792)] = (((acc0[7]-val45)*val46*alu36)+val48);
  data0_50176[(alu35+2048)] = (((acc0[8]-val45)*val46*alu36)+val48);
  data0_50176[(alu35+2304)] = (((acc0[9]-val45)*val46*alu36)+val48);
  data0_50176[(alu35+2560)] = (((acc0[10]-val45)*val46*alu36)+val48);
  data0_50176[(alu35+2816)] = (((acc0[11]-val45)*val46*alu36)+val48);
  data0_50176[(alu35+3072)] = (((acc0[12]-val45)*val46*alu36)+val48);
  data0_50176[(alu35+3328)] = (((acc0[13]-val45)*val46*alu36)+val48);
}`;

const E_256_28_7 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_50176:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_50176:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_50176:array<f32>;
@compute @workgroup_size(1) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 28 */
  var gidx1 = i32(gindex.y); /* 256 */
  var alu0 = (gidx1+(gidx0*1792));
  var val0 = data1_50176[alu0];
  var alu1 = (alu0+256);
  var val1 = data1_50176[alu1];
  var alu2 = (alu0+512);
  var val2 = data1_50176[alu2];
  var alu3 = (alu0+768);
  var val3 = data1_50176[alu3];
  var alu4 = (alu0+1024);
  var val4 = data1_50176[alu4];
  var alu5 = (alu0+1280);
  var val5 = data1_50176[alu5];
  var alu6 = (alu0+1536);
  var val6 = data1_50176[alu6];
  var val7 = data2_50176[alu0];
  var val8 = data2_50176[alu1];
  var val9 = data2_50176[alu2];
  var val10 = data2_50176[alu3];
  var val11 = data2_50176[alu4];
  var val12 = data2_50176[alu5];
  var val13 = data2_50176[alu6];
  var alu7 = ((gidx0*7)+(gidx1*196));
  data0_50176[(alu7+1)] = (val1+val8);
  data0_50176[(alu7+2)] = (val2+val9);
  data0_50176[(alu7+3)] = (val3+val10);
  data0_50176[(alu7+4)] = (val4+val11);
  data0_50176[(alu7+5)] = (val5+val12);
  data0_50176[(alu7+6)] = (val6+val13);
  data0_50176[alu7] = (val0+val7);
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
      var alu14 = (gidx0+Ridx2);
      var alu15 = (alu14+(Ridx0*196));
      var alu16 = ((0<alu14)&(alu14<15));
      var val0 = select(0.0f, data1_50176[(alu15+-1)], alu16);
      var alu17 = ((gidx1*73728)+(lidx0*2304)+(Ridx0*9)+Ridx2);
      var val1 = data2_589824[(alu17+3)];
      var val2 = select(0.0f, data1_50176[(alu15+13)], alu16);
      var val3 = data2_589824[(alu17+6)];
      var val4 = data2_589824[alu17];
      var val5 = select(0.0f, data1_50176[(alu15+27)], alu16);
      var val6 = select(0.0f, data1_50176[(alu15+41)], alu16);
      var val7 = select(0.0f, data1_50176[(alu15+55)], alu16);
      var val8 = select(0.0f, data1_50176[(alu15+69)], alu16);
      var val9 = select(0.0f, data1_50176[(alu15+83)], alu16);
      var val10 = select(0.0f, data1_50176[(alu15+97)], alu16);
      var val11 = select(0.0f, data1_50176[(alu15+111)], alu16);
      var val12 = select(0.0f, data1_50176[(alu15+125)], alu16);
      var val13 = select(0.0f, data1_50176[(alu15+139)], alu16);
      var val14 = select(0.0f, data1_50176[(alu15+153)], alu16);
      var val15 = select(0.0f, data1_50176[(alu15+167)], alu16);
      var val16 = select(0.0f, data1_50176[(alu15+181)], alu16);
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
  var alu34 = (lidx0+bitcast<i32>((bitcast<u32>(gidx1)<<5u)));
  var val17 = data3_256[alu34];
  var val18 = data4_256[alu34];
  var val19 = data5_256[alu34];
  var val20 = data6_256[alu34];
  var val21 = data7_256[alu34];
  var alu35 = (gidx0+(gidx1*6272)+(lidx0*196));
  var alu36 = (1/sqrt((val19+1e-05f)));
  var alu37 = (((acc0[0]-val17)*val18*alu36)+val20);
  var alu38 = (((acc0[1]-val17)*val18*alu36)+val20);
  var alu39 = (((acc0[2]-val17)*val18*alu36)+val20);
  var alu40 = (((acc0[3]-val17)*val18*alu36)+val20);
  var alu41 = (((acc0[4]-val17)*val18*alu36)+val20);
  var alu42 = (((acc0[5]-val17)*val18*alu36)+val20);
  var alu43 = (((acc0[6]-val17)*val18*alu36)+val20);
  var alu44 = (((acc0[7]-val17)*val18*alu36)+val20);
  var alu45 = (((acc0[8]-val17)*val18*alu36)+val20);
  var alu46 = (((acc0[9]-val17)*val18*alu36)+val20);
  var alu47 = (((acc0[10]-val17)*val18*alu36)+val20);
  var alu48 = (((acc0[11]-val17)*val18*alu36)+val20);
  var alu49 = (((acc0[12]-val17)*val18*alu36)+val20);
  var alu50 = (((acc0[13]-val17)*val18*alu36)+val20);
  var alu51 = select((val21*alu37),alu37,(0.0f<alu37));
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
  data0_50176[alu35] = alu51;
  data0_50176[(alu35+14)] = alu52;
  data0_50176[(alu35+28)] = alu53;
  data0_50176[(alu35+42)] = alu54;
  data0_50176[(alu35+56)] = alu55;
  data0_50176[(alu35+70)] = alu56;
  data0_50176[(alu35+84)] = alu57;
  data0_50176[(alu35+98)] = alu58;
  data0_50176[(alu35+112)] = alu59;
  data0_50176[(alu35+126)] = alu60;
  data0_50176[(alu35+140)] = alu61;
  data0_50176[(alu35+154)] = alu62;
  data0_50176[(alu35+168)] = alu63;
  data0_50176[(alu35+182)] = alu64;
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
      var alu14 = (gidx0+Ridx2);
      var alu15 = (alu14+(Ridx0*196));
      var alu16 = ((0<alu14)&(alu14<15));
      var val0 = select(0.0f, data1_50176[(alu15+-1)], alu16);
      var alu17 = ((gidx1*73728)+(lidx0*2304)+(Ridx0*9)+Ridx2);
      var val1 = data2_1179648[(alu17+3)];
      var val2 = select(0.0f, data1_50176[(alu15+13)], alu16);
      var val3 = data2_1179648[(alu17+6)];
      var val4 = data2_1179648[alu17];
      var val5 = select(0.0f, data1_50176[(alu15+27)], alu16);
      var val6 = select(0.0f, data1_50176[(alu15+41)], alu16);
      var val7 = select(0.0f, data1_50176[(alu15+55)], alu16);
      var val8 = select(0.0f, data1_50176[(alu15+69)], alu16);
      var val9 = select(0.0f, data1_50176[(alu15+83)], alu16);
      var val10 = select(0.0f, data1_50176[(alu15+97)], alu16);
      var val11 = select(0.0f, data1_50176[(alu15+111)], alu16);
      var val12 = select(0.0f, data1_50176[(alu15+125)], alu16);
      var val13 = select(0.0f, data1_50176[(alu15+139)], alu16);
      var val14 = select(0.0f, data1_50176[(alu15+153)], alu16);
      var val15 = select(0.0f, data1_50176[(alu15+167)], alu16);
      var val16 = select(0.0f, data1_50176[(alu15+181)], alu16);
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
  var alu34 = (lidx0+bitcast<i32>((bitcast<u32>(gidx1)<<5u)));
  var val17 = data3_512[alu34];
  var val18 = data4_512[alu34];
  var val19 = data5_512[alu34];
  var val20 = data6_512[alu34];
  var val21 = data7_512[alu34];
  var alu35 = (gidx0+(gidx1*6272)+(lidx0*196));
  var alu36 = (1/sqrt((val19+1e-05f)));
  var alu37 = (((acc0[0]-val17)*val18*alu36)+val20);
  var alu38 = (((acc0[1]-val17)*val18*alu36)+val20);
  var alu39 = (((acc0[2]-val17)*val18*alu36)+val20);
  var alu40 = (((acc0[3]-val17)*val18*alu36)+val20);
  var alu41 = (((acc0[4]-val17)*val18*alu36)+val20);
  var alu42 = (((acc0[5]-val17)*val18*alu36)+val20);
  var alu43 = (((acc0[6]-val17)*val18*alu36)+val20);
  var alu44 = (((acc0[7]-val17)*val18*alu36)+val20);
  var alu45 = (((acc0[8]-val17)*val18*alu36)+val20);
  var alu46 = (((acc0[9]-val17)*val18*alu36)+val20);
  var alu47 = (((acc0[10]-val17)*val18*alu36)+val20);
  var alu48 = (((acc0[11]-val17)*val18*alu36)+val20);
  var alu49 = (((acc0[12]-val17)*val18*alu36)+val20);
  var alu50 = (((acc0[13]-val17)*val18*alu36)+val20);
  var alu51 = select((val21*alu37),alu37,(0.0f<alu37));
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
  data0_100352[alu35] = alu51;
  data0_100352[(alu35+14)] = alu52;
  data0_100352[(alu35+28)] = alu53;
  data0_100352[(alu35+42)] = alu54;
  data0_100352[(alu35+56)] = alu55;
  data0_100352[(alu35+70)] = alu56;
  data0_100352[(alu35+84)] = alu57;
  data0_100352[(alu35+98)] = alu58;
  data0_100352[(alu35+112)] = alu59;
  data0_100352[(alu35+126)] = alu60;
  data0_100352[(alu35+140)] = alu61;
  data0_100352[(alu35+154)] = alu62;
  data0_100352[(alu35+168)] = alu63;
  data0_100352[(alu35+182)] = alu64;
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
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 512; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu7 = (bitcast<i32>((bitcast<u32>(gidx1)<<1u))+Ridx1+(Ridx0*14)+-1);
      var alu8 = select(0,1,(alu7<0));
      var alu9 = (0<(gidx1+Ridx1));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu10 = ((gidx1*28)+(Ridx1*14)+Ridx2+(Ridx0*196));
        var alu11 = (alu10+-15);
        var alu12 = select(0,3,(alu11<0));
        var alu13 = ((alu11+alu12)>>2u);
        var alu14 = select(0,1,(alu13<0));
        var val0 = select(0.0f, data1_100352[(((alu7-(14*(((alu7*9363)>>17u)+alu8)))*14)+Ridx2+((((alu13*2675)>>17u)+alu14)*196)+-1)], ((0<Ridx2)&alu9));
        var val1 = data2_2359296[((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx0*73728)+(lidx0*4608))];
        var val2 = select(0.0f, data1_100352[(alu10+-13)], alu9);
        var val3 = select(0.0f, data1_100352[(alu10+-11)], alu9);
        var val4 = select(0.0f, data1_100352[(alu10+-9)], alu9);
        var val5 = select(0.0f, data1_100352[(alu10+-7)], alu9);
        var val6 = select(0.0f, data1_100352[(alu10+-5)], alu9);
        var val7 = select(0.0f, data1_100352[(alu10+-3)], alu9);
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
  var alu25 = (lidx0+bitcast<i32>((bitcast<u32>(gidx0)<<4u)));
  var val8 = data3_512[alu25];
  var val9 = data4_512[alu25];
  var val10 = data5_512[alu25];
  var val11 = data6_512[alu25];
  var alu26 = (alu25+(gidx1*3584));
  var alu27 = (1/sqrt((val10+1e-05f)));
  data0_25088[alu26] = (((acc0[0]-val8)*val9*alu27)+val11);
  data0_25088[(alu26+512)] = (((acc0[1]-val8)*val9*alu27)+val11);
  data0_25088[(alu26+1024)] = (((acc0[2]-val8)*val9*alu27)+val11);
  data0_25088[(alu26+1536)] = (((acc0[3]-val8)*val9*alu27)+val11);
  data0_25088[(alu26+2048)] = (((acc0[4]-val8)*val9*alu27)+val11);
  data0_25088[(alu26+2560)] = (((acc0[5]-val8)*val9*alu27)+val11);
  data0_25088[(alu26+3072)] = (((acc0[6]-val8)*val9*alu27)+val11);
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
      var alu9 = ((0<alu8)&(alu8<8));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu10 = (alu0+(Ridx1*7)+Ridx2+(Ridx0*49));
        var val0 = select(0.0f, data1_25088[(alu10+-8)], ((0<Ridx2)&alu9));
        var val1 = data2_2359296[((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx1*147456)+(lidx0*4608))];
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
  var alu21 = (lidx0+bitcast<i32>((bitcast<u32>(gidx1)<<5u)));
  var val8 = data3_512[alu21];
  var val9 = data4_512[alu21];
  var val10 = data5_512[alu21];
  var val11 = data6_512[alu21];
  var val12 = data7_512[alu21];
  var alu22 = ((gidx1*1568)+(lidx0*49)+alu0);
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
      var alu9 = ((0<alu8)&(alu8<8));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu10 = (alu0+(Ridx1*7)+Ridx2+(Ridx0*49));
        var val0 = select(0.0f, data1_25088[(alu10+-8)], ((0<Ridx2)&alu9));
        var val1 = data2_2359296[((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx1*147456)+(lidx0*4608))];
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
  var alu21 = (lidx0+bitcast<i32>((bitcast<u32>(gidx1)<<5u)));
  var val8 = data3_512[alu21];
  var val9 = data4_512[alu21];
  var val10 = data5_512[alu21];
  var val11 = data6_512[alu21];
  var alu22 = ((gidx1*1568)+(lidx0*49)+alu0);
  var alu23 = (alu22+1);
  var val12 = data7_25088[alu23];
  var val13 = data7_25088[alu22];
  var alu24 = (alu22+2);
  var val14 = data7_25088[alu24];
  var alu25 = (alu22+3);
  var val15 = data7_25088[alu25];
  var alu26 = (alu22+4);
  var val16 = data7_25088[alu26];
  var alu27 = (alu22+5);
  var val17 = data7_25088[alu27];
  var alu28 = (alu22+6);
  var val18 = data7_25088[alu28];
  var alu29 = (1/sqrt((val10+1e-05f)));
  data0_25088[alu23] = (((acc0[1]-val8)*val9*alu29)+val11+val12);
  data0_25088[alu24] = (((acc0[2]-val8)*val9*alu29)+val11+val14);
  data0_25088[alu25] = (((acc0[3]-val8)*val9*alu29)+val11+val15);
  data0_25088[alu26] = (((acc0[4]-val8)*val9*alu29)+val11+val16);
  data0_25088[alu27] = (((acc0[5]-val8)*val9*alu29)+val11+val17);
  data0_25088[alu28] = (((acc0[6]-val8)*val9*alu29)+val11+val18);
  data0_25088[alu22] = (((acc0[0]-val8)*val9*alu29)+val11+val13);
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

const E_512_7_7 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_25088:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_25088:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_512:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_512:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_512:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_512:array<f32>;
@compute @workgroup_size(1) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 7 */
  var gidx1 = i32(gindex.y); /* 512 */
  var alu0 = (gidx1+(gidx0*3584));
  var val0 = data1_25088[alu0];
  var val1 = data2_512[gidx1];
  var val2 = data3_512[gidx1];
  var val3 = data4_512[gidx1];
  var val4 = data5_512[gidx1];
  var val5 = data1_25088[(alu0+512)];
  var val6 = data1_25088[(alu0+1024)];
  var val7 = data1_25088[(alu0+1536)];
  var val8 = data1_25088[(alu0+2048)];
  var val9 = data1_25088[(alu0+2560)];
  var val10 = data1_25088[(alu0+3072)];
  var alu1 = ((gidx0*7)+(gidx1*49));
  var alu2 = (1/sqrt((val3+1e-05f)));
  data0_25088[(alu1+1)] = (((val5+val1)*val2*alu2)+val4);
  data0_25088[(alu1+2)] = (((val6+val1)*val2*alu2)+val4);
  data0_25088[(alu1+3)] = (((val7+val1)*val2*alu2)+val4);
  data0_25088[(alu1+4)] = (((val8+val1)*val2*alu2)+val4);
  data0_25088[(alu1+5)] = (((val9+val1)*val2*alu2)+val4);
  data0_25088[(alu1+6)] = (((val10+val1)*val2*alu2)+val4);
  data0_25088[alu1] = (((val0+val1)*val2*alu2)+val4);
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

const r_16_32 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
var<workgroup> temp0: array<f32,16>;
@group(0) @binding(1)var<storage,read_write>data0_1:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_512:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,1>;
  var acc1: array<f32,1>;
  var lidx0 = i32(lindex.x); /* 16 */
  acc0[0] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 32; Ridx0++) {
    var val0 = data1_512[(bitcast<i32>((bitcast<u32>(lidx0)<<5u))+Ridx0)];
    acc0[0] = (acc0[0]+(val0*val0));
  }
  temp0[lidx0] = acc0[0];
  workgroupBarrier();
  acc1[0] = 0.0f;
  for (var Ridx101 = 0; Ridx101 < 16; Ridx101++) {
    var val1 = temp0[Ridx101];
    acc1[0] = (acc1[0]+val1);
  }
  var alu8 = ((bool(lidx0))!=true);
  if (alu8) {
    data0_1[0] = sqrt(acc1[0]);
  }
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

    const kernels = [r_16_28_7_16_4_4_3_3_3, E_256_2, E_64_784_16, r_16_56_32_7_2_2_64_3_3, r_2_8_56_32_7_64_3_3, E_8_3136_8, r_2_8_56_32_7_64_3_3n1, r_2_8_14_32_7_4_64_3_3, E_8_3136_8, r_2_8_56_32_7_64_3_3n1, r_2_8_14_32_7_4_64_3_3, E_8_3136_8, r_28_28_16_8_4_16, r_2_8_14_32_7_4_2_64_3_3, r_28_4_2_16_4_7_128_3_3, E_128_98_8, E_128_392_2, r_4_4_28_32_7_128_3_3, r_4_4_28_32_7_128_3_3n1, E_128_392_2, r_4_4_28_32_7_128_3_3, r_4_4_28_32_7_128_3_3n1, E_128_392_2, r_4_4_28_32_7_128_3_3, r_4_4_28_32_7_128_3_3n1, E_128_392_2, r_14_14_16_16_128, r_4_7_32_4_7_4_2_128_3_3, r_14_16_16_14_256_3_3, E_256_28_7, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_128_196_2, r_7_32_16_7_256, r_16_14_32_14_256_3_3, r_7_32_16_7_512_3_3, E_256_49_2, E_256_49_2n1, r_16_7_32_7_512_3_3, r_16_7_32_7_512_3_3n1, E_256_49_2n1, r_16_7_32_7_512_3_3, r_7_32_16_7_512_3_3n1, E_512_7_7, r_512_28_896, r_16_32, E_256_2n1];
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
        addComputePass(device, commandEncoder, pipelines[0], layouts[0], infinityBuf, [buf_0, input0, buf_1, buf_2, buf_3, buf_4, buf_5, buf_6], [7, 28, 16]);
        addComputePass(device, commandEncoder, pipelines[1], layouts[1], infinityBuf, [buf_7, buf_8], [256, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[2], layouts[2], infinityBuf, [buf_9, buf_0, buf_10, buf_11, buf_12, buf_13], [784, 64, 1]);
        addComputePass(device, commandEncoder, pipelines[3], layouts[3], infinityBuf, [buf_14, buf_9, buf_15, buf_16, buf_17, buf_18, buf_19, buf_20], [56, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[4], layouts[4], infinityBuf, [buf_21, buf_14, buf_22, buf_23, buf_24, buf_25, buf_26, buf_0], [56, 8, 2]);
        addComputePass(device, commandEncoder, pipelines[5], layouts[5], infinityBuf, [buf_27, buf_21, buf_28, buf_29, buf_30, buf_31], [3136, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[6], layouts[6], infinityBuf, [buf_32, buf_27, buf_33, buf_34, buf_35, buf_36, buf_37, buf_38], [56, 8, 2]);
        addComputePass(device, commandEncoder, pipelines[7], layouts[7], infinityBuf, [buf_27, buf_32, buf_39, buf_40, buf_41, buf_42, buf_43, buf_21], [14, 8, 2]);
        addComputePass(device, commandEncoder, pipelines[8], layouts[8], infinityBuf, [buf_32, buf_27, buf_44, buf_45, buf_46, buf_47], [3136, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[9], layouts[9], infinityBuf, [buf_21, buf_32, buf_48, buf_49, buf_50, buf_51, buf_52, buf_53], [56, 8, 2]);
        addComputePass(device, commandEncoder, pipelines[10], layouts[10], infinityBuf, [buf_32, buf_21, buf_54, buf_55, buf_56, buf_57, buf_58, buf_27], [14, 8, 2]);
        addComputePass(device, commandEncoder, pipelines[11], layouts[11], infinityBuf, [buf_21, buf_32, buf_59, buf_60, buf_61, buf_62], [3136, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[12], layouts[12], infinityBuf, [buf_63, buf_32, buf_64, buf_65, buf_66, buf_67, buf_68], [16, 28, 28]);
        addComputePass(device, commandEncoder, pipelines[13], layouts[13], infinityBuf, [buf_69, buf_21, buf_70, buf_71, buf_72, buf_73, buf_74, buf_75], [14, 8, 2]);
        addComputePass(device, commandEncoder, pipelines[14], layouts[14], infinityBuf, [buf_76, buf_69, buf_77, buf_78, buf_79, buf_80, buf_81], [2, 4, 28]);
        addComputePass(device, commandEncoder, pipelines[15], layouts[15], infinityBuf, [buf_82, buf_76, buf_63], [98, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[16], layouts[16], infinityBuf, [buf_76, buf_82, buf_83, buf_84, buf_85, buf_86], [392, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[17], layouts[17], infinityBuf, [buf_63, buf_76, buf_87, buf_88, buf_89, buf_90, buf_91, buf_92], [28, 4, 4]);
        addComputePass(device, commandEncoder, pipelines[18], layouts[18], infinityBuf, [buf_76, buf_63, buf_93, buf_94, buf_95, buf_96, buf_97, buf_82], [28, 4, 4]);
        addComputePass(device, commandEncoder, pipelines[19], layouts[19], infinityBuf, [buf_63, buf_76, buf_98, buf_99, buf_100, buf_101], [392, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[20], layouts[20], infinityBuf, [buf_82, buf_63, buf_102, buf_103, buf_104, buf_105, buf_106, buf_107], [28, 4, 4]);
        addComputePass(device, commandEncoder, pipelines[21], layouts[21], infinityBuf, [buf_63, buf_82, buf_108, buf_109, buf_110, buf_111, buf_112, buf_76], [28, 4, 4]);
        addComputePass(device, commandEncoder, pipelines[22], layouts[22], infinityBuf, [buf_82, buf_63, buf_113, buf_114, buf_115, buf_116], [392, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[23], layouts[23], infinityBuf, [buf_76, buf_82, buf_117, buf_118, buf_119, buf_120, buf_121, buf_122], [28, 4, 4]);
        addComputePass(device, commandEncoder, pipelines[24], layouts[24], infinityBuf, [buf_82, buf_76, buf_123, buf_124, buf_125, buf_126, buf_127, buf_63], [28, 4, 4]);
        addComputePass(device, commandEncoder, pipelines[25], layouts[25], infinityBuf, [buf_76, buf_82, buf_128, buf_129, buf_130, buf_131], [392, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[26], layouts[26], infinityBuf, [buf_132, buf_82, buf_133, buf_134, buf_135, buf_136, buf_137], [16, 14, 14]);
        addComputePass(device, commandEncoder, pipelines[27], layouts[27], infinityBuf, [buf_21, buf_76, buf_138, buf_139, buf_140, buf_141, buf_142, buf_143], [7, 4, 1]);
        addComputePass(device, commandEncoder, pipelines[28], layouts[28], infinityBuf, [buf_144, buf_21, buf_145, buf_146, buf_147, buf_148, buf_149], [16, 14, 1]);
        addComputePass(device, commandEncoder, pipelines[29], layouts[29], infinityBuf, [buf_150, buf_144, buf_132], [28, 256, 1]);
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
        addComputePass(device, commandEncoder, pipelines[80], layouts[80], infinityBuf, [buf_368, buf_350, buf_7, buf_399, buf_400, buf_401], [7, 512, 1]);
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
