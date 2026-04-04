
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

const r_2_28_7_16_4_4_4_2_3_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
@compute @workgroup_size(16,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,32>;
  var gidx0 = i32(gindex.x); /* 7 */
  var gidx1 = i32(gindex.y); /* 28 */
  var gidx2 = i32(gindex.z); /* 2 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 4 */
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
  for (var Ridx0 = 0; Ridx0 < 3; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu33 = ((bitcast<i32>((bitcast<u32>(gidx1)<<2u))+Ridx1)<110);
      var alu34 = (0<(gidx1+Ridx1));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu35 = ((((gidx0*48)+(lidx0*3)+(Ridx2*3))-Ridx0)+(gidx1*1344)+(Ridx1*336));
        var alu36 = (alu35+-337);
        var alu37 = select(0,3,(alu36<0));
        var alu38 = ((0<(gidx0+lidx0+Ridx2))&((alu0+Ridx2)<113));
        var val0 = select(0u, atomicLoad(&data1_37632[((alu36+alu37)>>2u)]), (alu38&alu34));
        var alu39 = (alu35+-1);
        var alu40 = select(0,3,(alu39<0));
        var val1 = select(0u, atomicLoad(&data1_37632[((alu39+alu40)>>2u)]), alu38);
        var alu41 = (alu35+335);
        var val2 = select(0u, atomicLoad(&data1_37632[(alu41>>2u)]), alu38);
        var alu42 = (alu35+671);
        var val3 = select(0u, atomicLoad(&data1_37632[(alu42>>2u)]), (alu38&alu33));
        var alu43 = ((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx2*864)+(lidx1*54));
        var val4 = data2_1728[(alu43+675)];
        var val5 = data2_1728[alu43];
        var val6 = data2_1728[(alu43+27)];
        var val7 = data2_1728[(alu43+216)];
        var val8 = data2_1728[(alu43+243)];
        var val9 = data2_1728[(alu43+432)];
        var val10 = data2_1728[(alu43+459)];
        var val11 = data2_1728[(alu43+648)];
        var alu44 = select(0.0f,((((f32((u32(((val0>>(((u32(alu36))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),(alu34&alu38));
        var alu45 = select(0.0f,((((f32((u32(((val1>>(((u32(alu39))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),alu38);
        var alu46 = select(0.0f,((((f32((u32(((val2>>(((u32(alu41))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),alu38);
        var alu47 = select(0.0f,((((f32((u32(((val3>>(((u32(alu42))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),(alu33&alu38));
        acc0[0] = (acc0[0]+(alu44*val5));
        acc0[1] = (acc0[1]+(alu44*val6));
        acc0[2] = (acc0[2]+(alu44*val7));
        acc0[3] = (acc0[3]+(alu44*val8));
        acc0[4] = (acc0[4]+(alu44*val9));
        acc0[5] = (acc0[5]+(alu44*val10));
        acc0[6] = (acc0[6]+(alu44*val11));
        acc0[7] = (acc0[7]+(alu44*val4));
        acc0[8] = (acc0[8]+(alu45*val5));
        acc0[9] = (acc0[9]+(alu45*val6));
        acc0[10] = (acc0[10]+(alu45*val7));
        acc0[11] = (acc0[11]+(alu45*val8));
        acc0[12] = (acc0[12]+(alu45*val9));
        acc0[13] = (acc0[13]+(alu45*val10));
        acc0[14] = (acc0[14]+(alu45*val11));
        acc0[15] = (acc0[15]+(alu45*val4));
        acc0[16] = (acc0[16]+(alu46*val5));
        acc0[17] = (acc0[17]+(alu46*val6));
        acc0[18] = (acc0[18]+(alu46*val7));
        acc0[19] = (acc0[19]+(alu46*val8));
        acc0[20] = (acc0[20]+(alu46*val9));
        acc0[21] = (acc0[21]+(alu46*val10));
        acc0[22] = (acc0[22]+(alu46*val11));
        acc0[23] = (acc0[23]+(alu46*val4));
        acc0[24] = (acc0[24]+(alu47*val5));
        acc0[25] = (acc0[25]+(alu47*val6));
        acc0[26] = (acc0[26]+(alu47*val7));
        acc0[27] = (acc0[27]+(alu47*val8));
        acc0[28] = (acc0[28]+(alu47*val9));
        acc0[29] = (acc0[29]+(alu47*val10));
        acc0[30] = (acc0[30]+(alu47*val11));
        acc0[31] = (acc0[31]+(alu47*val4));
      }
    }
  }
  var alu83 = (bitcast<i32>((bitcast<u32>(gidx2)<<5u))+bitcast<i32>((bitcast<u32>(lidx1)<<1u)));
  var val12 = data3_64[alu83];
  var val13 = data4_64[alu83];
  var val14 = data5_64[alu83];
  var val15 = data6_64[alu83];
  var val16 = data7_64[alu83];
  var alu84 = (alu83+1);
  var val17 = data3_64[alu84];
  var val18 = data4_64[alu84];
  var val19 = data5_64[alu84];
  var val20 = data6_64[alu84];
  var val21 = data7_64[alu84];
  var alu85 = (alu83+8);
  var val22 = data3_64[alu85];
  var val23 = data4_64[alu85];
  var val24 = data5_64[alu85];
  var val25 = data6_64[alu85];
  var val26 = data7_64[alu85];
  var alu86 = (alu83+9);
  var val27 = data3_64[alu86];
  var val28 = data4_64[alu86];
  var val29 = data5_64[alu86];
  var val30 = data6_64[alu86];
  var val31 = data7_64[alu86];
  var alu87 = (alu83+16);
  var val32 = data3_64[alu87];
  var val33 = data4_64[alu87];
  var val34 = data5_64[alu87];
  var val35 = data6_64[alu87];
  var val36 = data7_64[alu87];
  var alu88 = (alu83+17);
  var val37 = data3_64[alu88];
  var alu89 = (alu83+24);
  var val38 = data3_64[alu89];
  var alu90 = (alu83+25);
  var val39 = data3_64[alu90];
  var val40 = data4_64[alu88];
  var val41 = data4_64[alu89];
  var val42 = data4_64[alu90];
  var val43 = data5_64[alu88];
  var val44 = data5_64[alu89];
  var val45 = data5_64[alu90];
  var val46 = data6_64[alu88];
  var val47 = data6_64[alu89];
  var val48 = data6_64[alu90];
  var val49 = data7_64[alu88];
  var val50 = data7_64[alu89];
  var val51 = data7_64[alu90];
  var alu91 = (alu0+(gidx1*448)+(gidx2*401408)+(lidx1*25088));
  var alu92 = (1/sqrt((val14+1e-05f)));
  var alu93 = (1/sqrt((val19+1e-05f)));
  var alu94 = (1/sqrt((val24+1e-05f)));
  var alu95 = (1/sqrt((val29+1e-05f)));
  var alu96 = (1/sqrt((val34+1e-05f)));
  var alu97 = (1/sqrt((val43+1e-05f)));
  var alu98 = (1/sqrt((val44+1e-05f)));
  var alu99 = (1/sqrt((val45+1e-05f)));
  var alu100 = (((acc0[0]-val12)*val13*alu92)+val15);
  var alu101 = (((acc0[1]-val17)*val18*alu93)+val20);
  var alu102 = (((acc0[2]-val22)*val23*alu94)+val25);
  var alu103 = (((acc0[3]-val27)*val28*alu95)+val30);
  var alu104 = (((acc0[4]-val32)*val33*alu96)+val35);
  var alu105 = (((acc0[5]-val37)*val40*alu97)+val46);
  var alu106 = (((acc0[6]-val38)*val41*alu98)+val47);
  var alu107 = (((acc0[7]-val39)*val42*alu99)+val48);
  var alu108 = (((acc0[8]-val12)*val13*alu92)+val15);
  var alu109 = (((acc0[9]-val17)*val18*alu93)+val20);
  var alu110 = (((acc0[10]-val22)*val23*alu94)+val25);
  var alu111 = (((acc0[11]-val27)*val28*alu95)+val30);
  var alu112 = (((acc0[12]-val32)*val33*alu96)+val35);
  var alu113 = (((acc0[13]-val37)*val40*alu97)+val46);
  var alu114 = (((acc0[14]-val38)*val41*alu98)+val47);
  var alu115 = (((acc0[15]-val39)*val42*alu99)+val48);
  var alu116 = (((acc0[16]-val12)*val13*alu92)+val15);
  var alu117 = (((acc0[17]-val17)*val18*alu93)+val20);
  var alu118 = (((acc0[18]-val22)*val23*alu94)+val25);
  var alu119 = (((acc0[19]-val27)*val28*alu95)+val30);
  var alu120 = (((acc0[20]-val32)*val33*alu96)+val35);
  var alu121 = (((acc0[21]-val37)*val40*alu97)+val46);
  var alu122 = (((acc0[22]-val38)*val41*alu98)+val47);
  var alu123 = (((acc0[23]-val39)*val42*alu99)+val48);
  var alu124 = (((acc0[24]-val12)*val13*alu92)+val15);
  var alu125 = (((acc0[25]-val17)*val18*alu93)+val20);
  var alu126 = (((acc0[26]-val22)*val23*alu94)+val25);
  var alu127 = (((acc0[27]-val27)*val28*alu95)+val30);
  var alu128 = (((acc0[28]-val32)*val33*alu96)+val35);
  var alu129 = (((acc0[29]-val37)*val40*alu97)+val46);
  var alu130 = (((acc0[30]-val38)*val41*alu98)+val47);
  var alu131 = (((acc0[31]-val39)*val42*alu99)+val48);
  var alu132 = select((val16*alu100),alu100,(0.0f<alu100));
  var alu133 = select((val21*alu101),alu101,(0.0f<alu101));
  var alu134 = select((val26*alu102),alu102,(0.0f<alu102));
  var alu135 = select((val31*alu103),alu103,(0.0f<alu103));
  var alu136 = select((val36*alu104),alu104,(0.0f<alu104));
  var alu137 = select((val49*alu105),alu105,(0.0f<alu105));
  var alu138 = select((val50*alu106),alu106,(0.0f<alu106));
  var alu139 = select((val51*alu107),alu107,(0.0f<alu107));
  var alu140 = select((val16*alu108),alu108,(0.0f<alu108));
  var alu141 = select((val21*alu109),alu109,(0.0f<alu109));
  var alu142 = select((val26*alu110),alu110,(0.0f<alu110));
  var alu143 = select((val31*alu111),alu111,(0.0f<alu111));
  var alu144 = select((val36*alu112),alu112,(0.0f<alu112));
  var alu145 = select((val49*alu113),alu113,(0.0f<alu113));
  var alu146 = select((val50*alu114),alu114,(0.0f<alu114));
  var alu147 = select((val51*alu115),alu115,(0.0f<alu115));
  var alu148 = select((val16*alu116),alu116,(0.0f<alu116));
  var alu149 = select((val21*alu117),alu117,(0.0f<alu117));
  var alu150 = select((val26*alu118),alu118,(0.0f<alu118));
  var alu151 = select((val31*alu119),alu119,(0.0f<alu119));
  var alu152 = select((val36*alu120),alu120,(0.0f<alu120));
  var alu153 = select((val49*alu121),alu121,(0.0f<alu121));
  var alu154 = select((val50*alu122),alu122,(0.0f<alu122));
  var alu155 = select((val51*alu123),alu123,(0.0f<alu123));
  var alu156 = select((val16*alu124),alu124,(0.0f<alu124));
  var alu157 = select((val21*alu125),alu125,(0.0f<alu125));
  var alu158 = select((val26*alu126),alu126,(0.0f<alu126));
  var alu159 = select((val31*alu127),alu127,(0.0f<alu127));
  var alu160 = select((val36*alu128),alu128,(0.0f<alu128));
  var alu161 = select((val49*alu129),alu129,(0.0f<alu129));
  var alu162 = select((val50*alu130),alu130,(0.0f<alu130));
  var alu163 = select((val51*alu131),alu131,(0.0f<alu131));
  data0_802816[alu91] = alu132;
  data0_802816[(alu91+112)] = alu140;
  data0_802816[(alu91+224)] = alu148;
  data0_802816[(alu91+336)] = alu156;
  data0_802816[(alu91+12544)] = alu133;
  data0_802816[(alu91+12656)] = alu141;
  data0_802816[(alu91+12768)] = alu149;
  data0_802816[(alu91+12880)] = alu157;
  data0_802816[(alu91+100352)] = alu134;
  data0_802816[(alu91+100464)] = alu142;
  data0_802816[(alu91+100576)] = alu150;
  data0_802816[(alu91+100688)] = alu158;
  data0_802816[(alu91+112896)] = alu135;
  data0_802816[(alu91+113008)] = alu143;
  data0_802816[(alu91+113120)] = alu151;
  data0_802816[(alu91+113232)] = alu159;
  data0_802816[(alu91+200704)] = alu136;
  data0_802816[(alu91+200816)] = alu144;
  data0_802816[(alu91+200928)] = alu152;
  data0_802816[(alu91+201040)] = alu160;
  data0_802816[(alu91+213248)] = alu137;
  data0_802816[(alu91+213360)] = alu145;
  data0_802816[(alu91+213472)] = alu153;
  data0_802816[(alu91+213584)] = alu161;
  data0_802816[(alu91+301056)] = alu138;
  data0_802816[(alu91+301168)] = alu146;
  data0_802816[(alu91+301280)] = alu154;
  data0_802816[(alu91+301392)] = alu162;
  data0_802816[(alu91+313600)] = alu139;
  data0_802816[(alu91+313712)] = alu147;
  data0_802816[(alu91+313824)] = alu155;
  data0_802816[(alu91+313936)] = alu163;
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

const r_2_8_56_32_7_2_2_64_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
      var alu29 = (((gidx1*14)+Ridx1)<100);
      var alu30 = (0<(gidx1+Ridx1));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu31 = (cast0+Ridx2);
        var alu32 = (alu31+alu0+(Ridx1*112)+(Ridx0*12544));
        var alu33 = (0<(gidx0+Ridx2));
        var val0 = select(0.0f, data1_802816[(alu32+-113)], (alu33&alu30));
        var val1 = data2_36864[((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx2*18432)+(lidx0*576))];
        var alu34 = (alu31<112);
        var val2 = select(0.0f, data1_802816[(alu32+-112)], (alu34&alu30));
        var val3 = select(0.0f, data1_802816[(alu32+-1)], alu33);
        var val4 = select(0.0f, data1_802816[(alu32+671)], alu33);
        var val5 = select(0.0f, data1_802816[(alu32+672)], alu34);
        var val6 = select(0.0f, data1_802816[alu32], alu34);
        var val7 = select(0.0f, data1_802816[(alu32+783)], alu33);
        var val8 = select(0.0f, data1_802816[(alu32+111)], alu33);
        var val9 = select(0.0f, data1_802816[(alu32+784)], alu34);
        var val10 = select(0.0f, data1_802816[(alu32+112)], alu34);
        var val11 = select(0.0f, data1_802816[(alu32+895)], alu33);
        var val12 = select(0.0f, data1_802816[(alu32+896)], alu34);
        var val13 = select(0.0f, data1_802816[(alu32+223)], alu33);
        var val14 = select(0.0f, data1_802816[(alu32+224)], alu34);
        var val15 = select(0.0f, data1_802816[(alu32+1007)], alu33);
        var val16 = select(0.0f, data1_802816[(alu32+336)], alu34);
        var val17 = select(0.0f, data1_802816[(alu32+1008)], alu34);
        var val18 = select(0.0f, data1_802816[(alu32+335)], alu33);
        var val19 = select(0.0f, data1_802816[(alu32+448)], alu34);
        var val20 = select(0.0f, data1_802816[(alu32+1119)], alu33);
        var val21 = select(0.0f, data1_802816[(alu32+1120)], alu34);
        var val22 = select(0.0f, data1_802816[(alu32+447)], alu33);
        var val23 = select(0.0f, data1_802816[(alu32+1231)], alu33);
        var val24 = select(0.0f, data1_802816[(alu32+1232)], alu34);
        var val25 = select(0.0f, data1_802816[(alu32+559)], alu33);
        var val26 = select(0.0f, data1_802816[(alu32+560)], alu34);
        var val27 = select(0.0f, data1_802816[(alu32+1343)], (alu33&alu29));
        var val28 = select(0.0f, data1_802816[(alu32+1344)], (alu34&alu29));
        acc0[0] = (acc0[0]+(val0*val1));
        acc0[1] = (acc0[1]+(val2*val1));
        acc0[2] = (acc0[2]+(val4*val1));
        acc0[3] = (acc0[3]+(val5*val1));
        acc0[4] = (acc0[4]+(val3*val1));
        acc0[5] = (acc0[5]+(val6*val1));
        acc0[6] = (acc0[6]+(val7*val1));
        acc0[7] = (acc0[7]+(val9*val1));
        acc0[8] = (acc0[8]+(val8*val1));
        acc0[9] = (acc0[9]+(val10*val1));
        acc0[10] = (acc0[10]+(val11*val1));
        acc0[11] = (acc0[11]+(val12*val1));
        acc0[12] = (acc0[12]+(val13*val1));
        acc0[13] = (acc0[13]+(val14*val1));
        acc0[14] = (acc0[14]+(val15*val1));
        acc0[15] = (acc0[15]+(val17*val1));
        acc0[16] = (acc0[16]+(val18*val1));
        acc0[17] = (acc0[17]+(val16*val1));
        acc0[18] = (acc0[18]+(val20*val1));
        acc0[19] = (acc0[19]+(val21*val1));
        acc0[20] = (acc0[20]+(val22*val1));
        acc0[21] = (acc0[21]+(val19*val1));
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
  var val33 = data7_64[alu66];
  var alu67 = (cast0+alu0+(gidx2*401408)+(lidx0*12544));
  var alu68 = (1/sqrt((val31+1e-05f)));
  var alu69 = (((acc0[0]-val29)*val30*alu68)+val32);
  var alu70 = (((acc0[1]-val29)*val30*alu68)+val32);
  var alu71 = select((val33*alu69),alu69,(0.0f<alu69));
  var alu72 = select((val33*alu70),alu70,(0.0f<alu70));
  data0_802816[alu67] = alu71;
  data0_802816[(alu67+1)] = alu72;
  var alu75 = (((acc0[4]-val29)*val30*alu68)+val32);
  var alu76 = (((acc0[5]-val29)*val30*alu68)+val32);
  var alu77 = select((val33*alu75),alu75,(0.0f<alu75));
  var alu78 = select((val33*alu76),alu76,(0.0f<alu76));
  data0_802816[(alu67+112)] = alu77;
  data0_802816[(alu67+113)] = alu78;
  var alu81 = (((acc0[8]-val29)*val30*alu68)+val32);
  var alu82 = (((acc0[9]-val29)*val30*alu68)+val32);
  var alu83 = select((val33*alu81),alu81,(0.0f<alu81));
  var alu84 = select((val33*alu82),alu82,(0.0f<alu82));
  data0_802816[(alu67+224)] = alu83;
  data0_802816[(alu67+225)] = alu84;
  var alu87 = (((acc0[12]-val29)*val30*alu68)+val32);
  var alu88 = (((acc0[13]-val29)*val30*alu68)+val32);
  var alu89 = select((val33*alu87),alu87,(0.0f<alu87));
  var alu90 = select((val33*alu88),alu88,(0.0f<alu88));
  data0_802816[(alu67+336)] = alu89;
  data0_802816[(alu67+337)] = alu90;
  var alu93 = (((acc0[16]-val29)*val30*alu68)+val32);
  var alu94 = (((acc0[17]-val29)*val30*alu68)+val32);
  var alu95 = select((val33*alu93),alu93,(0.0f<alu93));
  var alu96 = select((val33*alu94),alu94,(0.0f<alu94));
  data0_802816[(alu67+448)] = alu95;
  data0_802816[(alu67+449)] = alu96;
  var alu99 = (((acc0[20]-val29)*val30*alu68)+val32);
  var alu100 = (((acc0[21]-val29)*val30*alu68)+val32);
  var alu101 = select((val33*alu99),alu99,(0.0f<alu99));
  var alu102 = select((val33*alu100),alu100,(0.0f<alu100));
  data0_802816[(alu67+560)] = alu101;
  data0_802816[(alu67+561)] = alu102;
  var alu105 = (((acc0[24]-val29)*val30*alu68)+val32);
  var alu106 = (((acc0[25]-val29)*val30*alu68)+val32);
  var alu107 = select((val33*alu105),alu105,(0.0f<alu105));
  var alu108 = select((val33*alu106),alu106,(0.0f<alu106));
  data0_802816[(alu67+672)] = alu107;
  data0_802816[(alu67+673)] = alu108;
  var alu111 = (((acc0[2]-val29)*val30*alu68)+val32);
  var alu112 = (((acc0[3]-val29)*val30*alu68)+val32);
  var alu113 = select((val33*alu111),alu111,(0.0f<alu111));
  var alu114 = select((val33*alu112),alu112,(0.0f<alu112));
  data0_802816[(alu67+784)] = alu113;
  data0_802816[(alu67+785)] = alu114;
  var alu117 = (((acc0[6]-val29)*val30*alu68)+val32);
  var alu118 = (((acc0[7]-val29)*val30*alu68)+val32);
  var alu119 = select((val33*alu117),alu117,(0.0f<alu117));
  var alu120 = select((val33*alu118),alu118,(0.0f<alu118));
  data0_802816[(alu67+896)] = alu119;
  data0_802816[(alu67+897)] = alu120;
  var alu123 = (((acc0[10]-val29)*val30*alu68)+val32);
  var alu124 = (((acc0[11]-val29)*val30*alu68)+val32);
  var alu125 = select((val33*alu123),alu123,(0.0f<alu123));
  var alu126 = select((val33*alu124),alu124,(0.0f<alu124));
  data0_802816[(alu67+1008)] = alu125;
  data0_802816[(alu67+1009)] = alu126;
  var alu129 = (((acc0[14]-val29)*val30*alu68)+val32);
  var alu130 = (((acc0[15]-val29)*val30*alu68)+val32);
  var alu131 = select((val33*alu129),alu129,(0.0f<alu129));
  var alu132 = select((val33*alu130),alu130,(0.0f<alu130));
  data0_802816[(alu67+1120)] = alu131;
  data0_802816[(alu67+1121)] = alu132;
  var alu135 = (((acc0[18]-val29)*val30*alu68)+val32);
  var alu136 = (((acc0[19]-val29)*val30*alu68)+val32);
  var alu137 = select((val33*alu135),alu135,(0.0f<alu135));
  var alu138 = select((val33*alu136),alu136,(0.0f<alu136));
  data0_802816[(alu67+1232)] = alu137;
  data0_802816[(alu67+1233)] = alu138;
  var alu141 = (((acc0[22]-val29)*val30*alu68)+val32);
  var alu142 = (((acc0[23]-val29)*val30*alu68)+val32);
  var alu143 = select((val33*alu141),alu141,(0.0f<alu141));
  var alu144 = select((val33*alu142),alu142,(0.0f<alu142));
  data0_802816[(alu67+1344)] = alu143;
  data0_802816[(alu67+1345)] = alu144;
  var alu147 = (((acc0[26]-val29)*val30*alu68)+val32);
  var alu148 = (((acc0[27]-val29)*val30*alu68)+val32);
  var alu149 = select((val33*alu147),alu147,(0.0f<alu147));
  var alu150 = select((val33*alu148),alu148,(0.0f<alu148));
  data0_802816[(alu67+1456)] = alu149;
  data0_802816[(alu67+1457)] = alu150;
}`;

const r_2_28_8_32_7_2_64_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  var acc0: array<f32,14>;
  var gidx0 = i32(gindex.x); /* 8 */
  var gidx1 = i32(gindex.y); /* 28 */
  var gidx2 = i32(gindex.z); /* 2 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx0*14);
  var alu1 = (gidx1*448);
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
  for (var Ridx0 = 0; Ridx0 < 64; Ridx0++) {
    for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
      var alu17 = (alu0+Ridx2+alu1+(Ridx0*12544));
      var alu18 = (0<(gidx0+Ridx2));
      var val0 = select(0.0f, data1_802816[(alu17+-113)], (alu18&alu2));
      var alu19 = ((gidx2*18432)+(lidx0*576)+(Ridx0*9)+Ridx2);
      var val1 = data2_36864[(alu19+3)];
      var val2 = data2_36864[alu19];
      var val3 = select(0.0f, data1_802816[(alu17+-111)], alu2);
      var val4 = select(0.0f, data1_802816[(alu17+-1)], alu18);
      var val5 = data1_802816[(alu17+1)];
      var val6 = data1_802816[(alu17+3)];
      var val7 = select(0.0f, data1_802816[(alu17+111)], alu18);
      var val8 = data2_36864[(alu19+6)];
      var val9 = data1_802816[(alu17+113)];
      var val10 = select(0.0f, data1_802816[(alu17+223)], alu18);
      var val11 = select(0.0f, data1_802816[(alu17+335)], alu18);
      var val12 = select(0.0f, data1_802816[(alu17+-109)], alu2);
      var val13 = data1_802816[(alu17+225)];
      var val14 = data1_802816[(alu17+337)];
      var val15 = data1_802816[(alu17+5)];
      var val16 = data1_802816[(alu17+115)];
      var val17 = select(0.0f, data1_802816[(alu17+-107)], alu2);
      var val18 = data1_802816[(alu17+227)];
      var val19 = data1_802816[(alu17+339)];
      var val20 = data1_802816[(alu17+7)];
      var val21 = data1_802816[(alu17+117)];
      var val22 = select(0.0f, data1_802816[(alu17+-105)], alu2);
      var val23 = data1_802816[(alu17+229)];
      var val24 = data1_802816[(alu17+341)];
      var val25 = data1_802816[(alu17+9)];
      var val26 = data1_802816[(alu17+119)];
      var val27 = select(0.0f, data1_802816[(alu17+-103)], alu2);
      var val28 = data1_802816[(alu17+231)];
      var val29 = data1_802816[(alu17+343)];
      var val30 = data1_802816[(alu17+11)];
      var val31 = data1_802816[(alu17+121)];
      var val32 = select(0.0f, data1_802816[(alu17+-101)], alu2);
      var val33 = data1_802816[(alu17+233)];
      var val34 = data1_802816[(alu17+345)];
      var val35 = data1_802816[(alu17+123)];
      var val36 = data1_802816[(alu17+235)];
      var val37 = data1_802816[(alu17+347)];
      acc0[0] = (acc0[0]+(val0*val2)+(val4*val1)+(val7*val8));
      acc0[1] = (acc0[1]+(val7*val2)+(val10*val1)+(val11*val8));
      acc0[2] = (acc0[2]+(val3*val2)+(val5*val1)+(val9*val8));
      acc0[3] = (acc0[3]+(val9*val2)+(val13*val1)+(val14*val8));
      acc0[4] = (acc0[4]+(val12*val2)+(val6*val1)+(val16*val8));
      acc0[5] = (acc0[5]+(val16*val2)+(val18*val1)+(val19*val8));
      acc0[6] = (acc0[6]+(val17*val2)+(val15*val1)+(val21*val8));
      acc0[7] = (acc0[7]+(val21*val2)+(val23*val1)+(val24*val8));
      acc0[8] = (acc0[8]+(val22*val2)+(val20*val1)+(val26*val8));
      acc0[9] = (acc0[9]+(val26*val2)+(val28*val1)+(val29*val8));
      acc0[10] = (acc0[10]+(val27*val2)+(val25*val1)+(val31*val8));
      acc0[11] = (acc0[11]+(val31*val2)+(val33*val1)+(val34*val8));
      acc0[12] = (acc0[12]+(val32*val2)+(val30*val1)+(val35*val8));
      acc0[13] = (acc0[13]+(val35*val2)+(val36*val1)+(val37*val8));
    }
  }
  var alu36 = (lidx0+bitcast<i32>((bitcast<u32>(gidx2)<<5u)));
  var val38 = data3_64[alu36];
  var val39 = data4_64[alu36];
  var val40 = data5_64[alu36];
  var val41 = data6_64[alu36];
  var alu37 = (alu0+alu1+(gidx2*401408)+(lidx0*12544));
  var val42 = data7_802816[alu37];
  var val43 = data7_802816[(alu37+2)];
  var val44 = data7_802816[(alu37+4)];
  var val45 = data7_802816[(alu37+6)];
  var val46 = data7_802816[(alu37+8)];
  var val47 = data7_802816[(alu37+10)];
  var val48 = data7_802816[(alu37+12)];
  var val49 = data7_802816[(alu37+224)];
  var val50 = data7_802816[(alu37+226)];
  var val51 = data7_802816[(alu37+228)];
  var val52 = data7_802816[(alu37+230)];
  var val53 = data7_802816[(alu37+232)];
  var val54 = data7_802816[(alu37+234)];
  var val55 = data7_802816[(alu37+236)];
  var alu38 = ((gidx0*7)+(gidx1*112)+(gidx2*100352)+(lidx0*3136));
  var alu39 = (1/sqrt((val40+1e-05f)));
  data0_200704[(alu38+56)] = (((acc0[1]-val38)*val39*alu39)+val41+val49);
  data0_200704[(alu38+57)] = (((acc0[3]-val38)*val39*alu39)+val41+val50);
  data0_200704[(alu38+58)] = (((acc0[5]-val38)*val39*alu39)+val41+val51);
  data0_200704[(alu38+59)] = (((acc0[7]-val38)*val39*alu39)+val41+val52);
  data0_200704[(alu38+60)] = (((acc0[9]-val38)*val39*alu39)+val41+val53);
  data0_200704[(alu38+61)] = (((acc0[11]-val38)*val39*alu39)+val41+val54);
  data0_200704[(alu38+62)] = (((acc0[13]-val38)*val39*alu39)+val41+val55);
  data0_200704[(alu38+1)] = (((acc0[2]-val38)*val39*alu39)+val41+val43);
  data0_200704[(alu38+2)] = (((acc0[4]-val38)*val39*alu39)+val41+val44);
  data0_200704[(alu38+3)] = (((acc0[6]-val38)*val39*alu39)+val41+val45);
  data0_200704[(alu38+4)] = (((acc0[8]-val38)*val39*alu39)+val41+val46);
  data0_200704[(alu38+5)] = (((acc0[10]-val38)*val39*alu39)+val41+val47);
  data0_200704[(alu38+6)] = (((acc0[12]-val38)*val39*alu39)+val41+val48);
  data0_200704[alu38] = (((acc0[0]-val38)*val39*alu39)+val41+val42);
}`;

const E_64_392_8 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_200704:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_200704:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_64:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_64:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_64:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_64:array<f32>;
@compute @workgroup_size(8) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 392 */
  var gidx1 = i32(gindex.y); /* 64 */
  var lidx0 = i32(lindex.x); /* 8 */
  var alu0 = (lidx0+bitcast<i32>((bitcast<u32>(gidx0)<<3u))+(gidx1*3136));
  var val0 = data1_200704[alu0];
  var val1 = data2_64[gidx1];
  var val2 = data3_64[gidx1];
  var val3 = data4_64[gidx1];
  var val4 = data5_64[gidx1];
  data0_200704[alu0] = (((val0-val1)*val2*(1/sqrt((val3+1e-05f))))+val4);
}`;

const r_7_14_32_2_4_4_2_64_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
@compute @workgroup_size(32,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,32>;
  var gidx0 = i32(gindex.x); /* 14 */
  var gidx1 = i32(gindex.y); /* 7 */
  var lidx0 = i32(lindex.x); /* 32 */
  var lidx1 = i32(lindex.y); /* 2 */
  var cast0 = bitcast<i32>((bitcast<u32>(gidx0)<<2u));
  var alu0 = ((gidx1*448)+(lidx1*224));
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
  for (var Ridx0 = 0; Ridx0 < 64; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu35 = (alu0+(Ridx1*56)+cast0+(Ridx0*3136));
      var alu36 = (0<(gidx1+lidx1+Ridx1));
      var val0 = select(0.0f, data1_200704[(alu35+-57)], (alu2&alu36));
      var alu37 = ((Ridx0*9)+(Ridx1*3)+(lidx0*576));
      var val1 = data2_36864[(alu37+18432)];
      var val2 = data2_36864[(alu37+18434)];
      var val3 = data2_36864[alu37];
      var val4 = select(0.0f, data1_200704[(alu35+-56)], alu36);
      var val5 = data2_36864[(alu37+1)];
      var val6 = select(0.0f, data1_200704[(alu35+-55)], alu36);
      var val7 = data2_36864[(alu37+2)];
      var val8 = data2_36864[(alu37+18433)];
      var val9 = select(0.0f, data1_200704[(alu35+-54)], alu36);
      var val10 = select(0.0f, data1_200704[(alu35+-53)], alu36);
      var val11 = select(0.0f, data1_200704[(alu35+-52)], (alu1&alu36));
      var val12 = select(0.0f, data1_200704[(alu35+-1)], alu2);
      var val13 = data1_200704[(alu35+1)];
      var val14 = data1_200704[alu35];
      var val15 = data1_200704[(alu35+2)];
      var val16 = data1_200704[(alu35+3)];
      var val17 = select(0.0f, data1_200704[(alu35+4)], alu1);
      var val18 = select(0.0f, data1_200704[(alu35+55)], alu2);
      var val19 = data1_200704[(alu35+56)];
      var val20 = data1_200704[(alu35+57)];
      var val21 = data1_200704[(alu35+58)];
      var val22 = data1_200704[(alu35+59)];
      var val23 = select(0.0f, data1_200704[(alu35+60)], alu1);
      var alu38 = ((bitcast<i32>((bitcast<u32>(gidx1)<<3u))+bitcast<i32>((bitcast<u32>(lidx1)<<2u))+Ridx1)<54);
      var val24 = select(0.0f, data1_200704[(alu35+111)], (alu2&alu38));
      var val25 = select(0.0f, data1_200704[(alu35+112)], alu38);
      var val26 = select(0.0f, data1_200704[(alu35+113)], alu38);
      var val27 = select(0.0f, data1_200704[(alu35+114)], alu38);
      var val28 = select(0.0f, data1_200704[(alu35+115)], alu38);
      var val29 = select(0.0f, data1_200704[(alu35+116)], (alu1&alu38));
      acc0[0] = (acc0[0]+(val0*val3)+(val4*val5)+(val6*val7));
      acc0[1] = (acc0[1]+(val0*val1)+(val4*val8)+(val6*val2));
      acc0[2] = (acc0[2]+(val4*val3)+(val6*val5)+(val9*val7));
      acc0[3] = (acc0[3]+(val4*val1)+(val6*val8)+(val9*val2));
      acc0[4] = (acc0[4]+(val6*val3)+(val9*val5)+(val10*val7));
      acc0[5] = (acc0[5]+(val6*val1)+(val9*val8)+(val10*val2));
      acc0[6] = (acc0[6]+(val9*val3)+(val10*val5)+(val11*val7));
      acc0[7] = (acc0[7]+(val9*val1)+(val10*val8)+(val11*val2));
      acc0[8] = (acc0[8]+(val12*val3)+(val14*val5)+(val13*val7));
      acc0[9] = (acc0[9]+(val12*val1)+(val14*val8)+(val13*val2));
      acc0[10] = (acc0[10]+(val14*val3)+(val13*val5)+(val15*val7));
      acc0[11] = (acc0[11]+(val14*val1)+(val13*val8)+(val15*val2));
      acc0[12] = (acc0[12]+(val13*val3)+(val15*val5)+(val16*val7));
      acc0[13] = (acc0[13]+(val13*val1)+(val15*val8)+(val16*val2));
      acc0[14] = (acc0[14]+(val15*val3)+(val16*val5)+(val17*val7));
      acc0[15] = (acc0[15]+(val15*val1)+(val16*val8)+(val17*val2));
      acc0[16] = (acc0[16]+(val18*val3)+(val19*val5)+(val20*val7));
      acc0[17] = (acc0[17]+(val18*val1)+(val19*val8)+(val20*val2));
      acc0[18] = (acc0[18]+(val19*val3)+(val20*val5)+(val21*val7));
      acc0[19] = (acc0[19]+(val19*val1)+(val20*val8)+(val21*val2));
      acc0[20] = (acc0[20]+(val20*val3)+(val21*val5)+(val22*val7));
      acc0[21] = (acc0[21]+(val20*val1)+(val21*val8)+(val22*val2));
      acc0[22] = (acc0[22]+(val21*val3)+(val22*val5)+(val23*val7));
      acc0[23] = (acc0[23]+(val21*val1)+(val22*val8)+(val23*val2));
      acc0[24] = (acc0[24]+(val24*val3)+(val25*val5)+(val26*val7));
      acc0[25] = (acc0[25]+(val24*val1)+(val25*val8)+(val26*val2));
      acc0[26] = (acc0[26]+(val25*val3)+(val26*val5)+(val27*val7));
      acc0[27] = (acc0[27]+(val25*val1)+(val26*val8)+(val27*val2));
      acc0[28] = (acc0[28]+(val26*val3)+(val27*val5)+(val28*val7));
      acc0[29] = (acc0[29]+(val26*val1)+(val27*val8)+(val28*val2));
      acc0[30] = (acc0[30]+(val27*val3)+(val28*val5)+(val29*val7));
      acc0[31] = (acc0[31]+(val27*val1)+(val28*val8)+(val29*val2));
    }
  }
  var val30 = data3_64[lidx0];
  var val31 = data4_64[lidx0];
  var val32 = data5_64[lidx0];
  var val33 = data6_64[lidx0];
  var val34 = data7_64[lidx0];
  var alu73 = (lidx0+32);
  var val35 = data3_64[alu73];
  var val36 = data4_64[alu73];
  var val37 = data5_64[alu73];
  var val38 = data6_64[alu73];
  var val39 = data7_64[alu73];
  var alu74 = (alu0+cast0+(lidx0*3136));
  var alu75 = (1/sqrt((val32+1e-05f)));
  var alu76 = (((acc0[8]-val30)*val31*alu75)+val33);
  var alu77 = (((acc0[10]-val30)*val31*alu75)+val33);
  var alu78 = (((acc0[12]-val30)*val31*alu75)+val33);
  var alu79 = (((acc0[14]-val30)*val31*alu75)+val33);
  var alu80 = select((val34*alu76),alu76,(0.0f<alu76));
  var alu81 = select((val34*alu77),alu77,(0.0f<alu77));
  var alu82 = select((val34*alu78),alu78,(0.0f<alu78));
  var alu83 = select((val34*alu79),alu79,(0.0f<alu79));
  data0_200704[(alu74+56)] = alu80;
  data0_200704[(alu74+57)] = alu81;
  data0_200704[(alu74+58)] = alu82;
  data0_200704[(alu74+59)] = alu83;
  var alu88 = (((acc0[16]-val30)*val31*alu75)+val33);
  var alu89 = (((acc0[18]-val30)*val31*alu75)+val33);
  var alu90 = (((acc0[20]-val30)*val31*alu75)+val33);
  var alu91 = (((acc0[22]-val30)*val31*alu75)+val33);
  var alu92 = select((val34*alu88),alu88,(0.0f<alu88));
  var alu93 = select((val34*alu89),alu89,(0.0f<alu89));
  var alu94 = select((val34*alu90),alu90,(0.0f<alu90));
  var alu95 = select((val34*alu91),alu91,(0.0f<alu91));
  data0_200704[(alu74+112)] = alu92;
  data0_200704[(alu74+113)] = alu93;
  data0_200704[(alu74+114)] = alu94;
  data0_200704[(alu74+115)] = alu95;
  var alu100 = (((acc0[24]-val30)*val31*alu75)+val33);
  var alu101 = (((acc0[26]-val30)*val31*alu75)+val33);
  var alu102 = (((acc0[28]-val30)*val31*alu75)+val33);
  var alu103 = (((acc0[30]-val30)*val31*alu75)+val33);
  var alu104 = select((val34*alu100),alu100,(0.0f<alu100));
  var alu105 = select((val34*alu101),alu101,(0.0f<alu101));
  var alu106 = select((val34*alu102),alu102,(0.0f<alu102));
  var alu107 = select((val34*alu103),alu103,(0.0f<alu103));
  data0_200704[(alu74+168)] = alu104;
  data0_200704[(alu74+169)] = alu105;
  data0_200704[(alu74+170)] = alu106;
  data0_200704[(alu74+171)] = alu107;
  var alu112 = (1/sqrt((val37+1e-05f)));
  var alu113 = (((acc0[1]-val35)*val36*alu112)+val38);
  var alu114 = (((acc0[3]-val35)*val36*alu112)+val38);
  var alu115 = (((acc0[5]-val35)*val36*alu112)+val38);
  var alu116 = (((acc0[7]-val35)*val36*alu112)+val38);
  var alu117 = select((val39*alu113),alu113,(0.0f<alu113));
  var alu118 = select((val39*alu114),alu114,(0.0f<alu114));
  var alu119 = select((val39*alu115),alu115,(0.0f<alu115));
  var alu120 = select((val39*alu116),alu116,(0.0f<alu116));
  data0_200704[(alu74+100352)] = alu117;
  data0_200704[(alu74+100353)] = alu118;
  data0_200704[(alu74+100354)] = alu119;
  data0_200704[(alu74+100355)] = alu120;
  var alu125 = (((acc0[9]-val35)*val36*alu112)+val38);
  var alu126 = (((acc0[11]-val35)*val36*alu112)+val38);
  var alu127 = (((acc0[13]-val35)*val36*alu112)+val38);
  var alu128 = (((acc0[15]-val35)*val36*alu112)+val38);
  var alu129 = select((val39*alu125),alu125,(0.0f<alu125));
  var alu130 = select((val39*alu126),alu126,(0.0f<alu126));
  var alu131 = select((val39*alu127),alu127,(0.0f<alu127));
  var alu132 = select((val39*alu128),alu128,(0.0f<alu128));
  data0_200704[(alu74+100408)] = alu129;
  data0_200704[(alu74+100409)] = alu130;
  data0_200704[(alu74+100410)] = alu131;
  data0_200704[(alu74+100411)] = alu132;
  var alu137 = (((acc0[17]-val35)*val36*alu112)+val38);
  var alu138 = (((acc0[19]-val35)*val36*alu112)+val38);
  var alu139 = (((acc0[21]-val35)*val36*alu112)+val38);
  var alu140 = (((acc0[23]-val35)*val36*alu112)+val38);
  var alu141 = select((val39*alu137),alu137,(0.0f<alu137));
  var alu142 = select((val39*alu138),alu138,(0.0f<alu138));
  var alu143 = select((val39*alu139),alu139,(0.0f<alu139));
  var alu144 = select((val39*alu140),alu140,(0.0f<alu140));
  data0_200704[(alu74+100464)] = alu141;
  data0_200704[(alu74+100465)] = alu142;
  data0_200704[(alu74+100466)] = alu143;
  data0_200704[(alu74+100467)] = alu144;
  var alu149 = (((acc0[25]-val35)*val36*alu112)+val38);
  var alu150 = (((acc0[27]-val35)*val36*alu112)+val38);
  var alu151 = (((acc0[29]-val35)*val36*alu112)+val38);
  var alu152 = (((acc0[31]-val35)*val36*alu112)+val38);
  var alu153 = select((val39*alu149),alu149,(0.0f<alu149));
  var alu154 = select((val39*alu150),alu150,(0.0f<alu150));
  var alu155 = select((val39*alu151),alu151,(0.0f<alu151));
  var alu156 = select((val39*alu152),alu152,(0.0f<alu152));
  data0_200704[(alu74+100520)] = alu153;
  data0_200704[(alu74+100521)] = alu154;
  data0_200704[(alu74+100522)] = alu155;
  data0_200704[(alu74+100523)] = alu156;
  var alu161 = (((acc0[0]-val30)*val31*alu75)+val33);
  var alu162 = (((acc0[2]-val30)*val31*alu75)+val33);
  var alu163 = (((acc0[4]-val30)*val31*alu75)+val33);
  var alu164 = (((acc0[6]-val30)*val31*alu75)+val33);
  var alu165 = select((val34*alu161),alu161,(0.0f<alu161));
  var alu166 = select((val34*alu162),alu162,(0.0f<alu162));
  var alu167 = select((val34*alu163),alu163,(0.0f<alu163));
  var alu168 = select((val34*alu164),alu164,(0.0f<alu164));
  data0_200704[(alu74+1)] = alu166;
  data0_200704[(alu74+2)] = alu167;
  data0_200704[(alu74+3)] = alu168;
  data0_200704[alu74] = alu165;
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

const r_28_4_8_16_7_64 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  var acc0: array<f32,7>;
  var gidx0 = i32(gindex.x); /* 8 */
  var gidx1 = i32(gindex.y); /* 4 */
  var gidx2 = i32(gindex.z); /* 28 */
  var lidx0 = i32(lindex.x); /* 16 */
  var cast0 = bitcast<u32>(gidx0);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 64; Ridx0++) {
    var alu7 = ((gidx1*14)+(gidx2*112)+(Ridx0*3136));
    var val0 = data1_200704[alu7];
    var val1 = data2_8192[(bitcast<i32>((cast0<<10u))+bitcast<i32>((bitcast<u32>(lidx0)<<6u))+Ridx0)];
    var val2 = data1_200704[(alu7+2)];
    var val3 = data1_200704[(alu7+4)];
    var val4 = data1_200704[(alu7+6)];
    var val5 = data1_200704[(alu7+8)];
    var val6 = data1_200704[(alu7+10)];
    var val7 = data1_200704[(alu7+12)];
    acc0[0] = (acc0[0]+(val0*val1));
    acc0[1] = (acc0[1]+(val2*val1));
    acc0[2] = (acc0[2]+(val3*val1));
    acc0[3] = (acc0[3]+(val4*val1));
    acc0[4] = (acc0[4]+(val5*val1));
    acc0[5] = (acc0[5]+(val6*val1));
    acc0[6] = (acc0[6]+(val7*val1));
  }
  var alu16 = (lidx0+bitcast<i32>((cast0<<4u)));
  var val8 = data3_128[alu16];
  var val9 = data4_128[alu16];
  var val10 = data5_128[alu16];
  var val11 = data6_128[alu16];
  var alu17 = (alu16+(gidx1*896)+(gidx2*3584));
  var alu18 = (1/sqrt((val10+1e-05f)));
  data0_100352[alu17] = (((acc0[0]-val8)*val9*alu18)+val11);
  data0_100352[(alu17+128)] = (((acc0[1]-val8)*val9*alu18)+val11);
  data0_100352[(alu17+256)] = (((acc0[2]-val8)*val9*alu18)+val11);
  data0_100352[(alu17+384)] = (((acc0[3]-val8)*val9*alu18)+val11);
  data0_100352[(alu17+512)] = (((acc0[4]-val8)*val9*alu18)+val11);
  data0_100352[(alu17+640)] = (((acc0[5]-val8)*val9*alu18)+val11);
  data0_100352[(alu17+768)] = (((acc0[6]-val8)*val9*alu18)+val11);
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

const r_4_14_16_2_7_8_128_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_100352:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_401408:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_147456:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_128:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_128:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_128:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_128:array<f32>;
@compute @workgroup_size(16,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,56>;
  var gidx0 = i32(gindex.x); /* 14 */
  var gidx1 = i32(gindex.y); /* 4 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 2 */
  var cast0 = bitcast<u32>(gidx0);
  var cast1 = bitcast<u32>(lidx1);
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
        var alu56 = (bitcast<i32>((cast0<<2u))+bitcast<i32>((cast1<<1u))+Ridx2+(gidx1*784)+(Ridx1*56)+(Ridx0*3136));
        var alu57 = (0<(gidx0+lidx1+Ridx2));
        var val0 = select(0.0f, data1_401408[(alu56+-57)], (alu57&(0<(gidx1+Ridx1))));
        var alu58 = ((Ridx1*3)+Ridx2+(Ridx0*9)+(lidx0*1152));
        var val1 = data2_147456[alu58];
        var val2 = data2_147456[(alu58+18432)];
        var val3 = data2_147456[(alu58+36864)];
        var val4 = data2_147456[(alu58+55296)];
        var val5 = data2_147456[(alu58+73728)];
        var val6 = data2_147456[(alu58+92160)];
        var val7 = data2_147456[(alu58+110592)];
        var val8 = data2_147456[(alu58+129024)];
        var val9 = select(0.0f, data1_401408[(alu56+55)], alu57);
        var val10 = select(0.0f, data1_401408[(alu56+167)], alu57);
        var val11 = select(0.0f, data1_401408[(alu56+279)], alu57);
        var val12 = select(0.0f, data1_401408[(alu56+391)], alu57);
        var val13 = select(0.0f, data1_401408[(alu56+503)], alu57);
        var val14 = select(0.0f, data1_401408[(alu56+615)], alu57);
        acc0[0] = (acc0[0]+(val0*val1));
        acc0[1] = (acc0[1]+(val0*val2));
        acc0[2] = (acc0[2]+(val0*val3));
        acc0[3] = (acc0[3]+(val0*val4));
        acc0[4] = (acc0[4]+(val0*val5));
        acc0[5] = (acc0[5]+(val0*val6));
        acc0[6] = (acc0[6]+(val0*val7));
        acc0[7] = (acc0[7]+(val0*val8));
        acc0[8] = (acc0[8]+(val9*val1));
        acc0[9] = (acc0[9]+(val9*val2));
        acc0[10] = (acc0[10]+(val9*val3));
        acc0[11] = (acc0[11]+(val9*val4));
        acc0[12] = (acc0[12]+(val9*val5));
        acc0[13] = (acc0[13]+(val9*val6));
        acc0[14] = (acc0[14]+(val9*val7));
        acc0[15] = (acc0[15]+(val9*val8));
        acc0[16] = (acc0[16]+(val10*val1));
        acc0[17] = (acc0[17]+(val10*val2));
        acc0[18] = (acc0[18]+(val10*val3));
        acc0[19] = (acc0[19]+(val10*val4));
        acc0[20] = (acc0[20]+(val10*val5));
        acc0[21] = (acc0[21]+(val10*val6));
        acc0[22] = (acc0[22]+(val10*val7));
        acc0[23] = (acc0[23]+(val10*val8));
        acc0[24] = (acc0[24]+(val11*val1));
        acc0[25] = (acc0[25]+(val11*val2));
        acc0[26] = (acc0[26]+(val11*val3));
        acc0[27] = (acc0[27]+(val11*val4));
        acc0[28] = (acc0[28]+(val11*val5));
        acc0[29] = (acc0[29]+(val11*val6));
        acc0[30] = (acc0[30]+(val11*val7));
        acc0[31] = (acc0[31]+(val11*val8));
        acc0[32] = (acc0[32]+(val12*val1));
        acc0[33] = (acc0[33]+(val12*val2));
        acc0[34] = (acc0[34]+(val12*val3));
        acc0[35] = (acc0[35]+(val12*val4));
        acc0[36] = (acc0[36]+(val12*val5));
        acc0[37] = (acc0[37]+(val12*val6));
        acc0[38] = (acc0[38]+(val12*val7));
        acc0[39] = (acc0[39]+(val12*val8));
        acc0[40] = (acc0[40]+(val13*val1));
        acc0[41] = (acc0[41]+(val13*val2));
        acc0[42] = (acc0[42]+(val13*val3));
        acc0[43] = (acc0[43]+(val13*val4));
        acc0[44] = (acc0[44]+(val13*val5));
        acc0[45] = (acc0[45]+(val13*val6));
        acc0[46] = (acc0[46]+(val13*val7));
        acc0[47] = (acc0[47]+(val13*val8));
        acc0[48] = (acc0[48]+(val14*val1));
        acc0[49] = (acc0[49]+(val14*val2));
        acc0[50] = (acc0[50]+(val14*val3));
        acc0[51] = (acc0[51]+(val14*val4));
        acc0[52] = (acc0[52]+(val14*val5));
        acc0[53] = (acc0[53]+(val14*val6));
        acc0[54] = (acc0[54]+(val14*val7));
        acc0[55] = (acc0[55]+(val14*val8));
      }
    }
  }
  var val15 = data3_128[lidx0];
  var alu118 = (lidx0+16);
  var val16 = data3_128[alu118];
  var alu119 = (lidx0+32);
  var val17 = data3_128[alu119];
  var val18 = data4_128[lidx0];
  var val19 = data5_128[lidx0];
  var val20 = data6_128[lidx0];
  var val21 = data4_128[alu118];
  var val22 = data4_128[alu119];
  var val23 = data5_128[alu118];
  var val24 = data6_128[alu118];
  var alu120 = (lidx0+48);
  var val25 = data3_128[alu120];
  var val26 = data4_128[alu120];
  var val27 = data5_128[alu119];
  var val28 = data6_128[alu119];
  var val29 = data5_128[alu120];
  var val30 = data6_128[alu120];
  var alu121 = (lidx0+64);
  var val31 = data3_128[alu121];
  var alu122 = (lidx0+80);
  var val32 = data3_128[alu122];
  var val33 = data4_128[alu121];
  var val34 = data4_128[alu122];
  var val35 = data5_128[alu121];
  var val36 = data6_128[alu121];
  var val37 = data5_128[alu122];
  var val38 = data6_128[alu122];
  var alu123 = (lidx0+96);
  var val39 = data3_128[alu123];
  var alu124 = (lidx0+112);
  var val40 = data3_128[alu124];
  var val41 = data4_128[alu123];
  var val42 = data4_128[alu124];
  var val43 = data5_128[alu123];
  var val44 = data6_128[alu123];
  var val45 = data5_128[alu124];
  var val46 = data6_128[alu124];
  var alu125 = (lidx0+bitcast<i32>((cast0<<8u))+bitcast<i32>((cast1<<7u))+(gidx1*25088));
  var alu126 = (1/sqrt((val19+1e-05f)));
  var alu127 = (1/sqrt((val23+1e-05f)));
  var alu128 = (1/sqrt((val27+1e-05f)));
  var alu129 = (1/sqrt((val29+1e-05f)));
  var alu130 = (1/sqrt((val35+1e-05f)));
  var alu131 = (1/sqrt((val37+1e-05f)));
  var alu132 = (1/sqrt((val43+1e-05f)));
  var alu133 = (1/sqrt((val45+1e-05f)));
  data0_100352[alu125] = (((acc0[0]-val15)*val18*alu126)+val20);
  data0_100352[(alu125+16)] = (((acc0[1]-val16)*val21*alu127)+val24);
  data0_100352[(alu125+32)] = (((acc0[2]-val17)*val22*alu128)+val28);
  data0_100352[(alu125+48)] = (((acc0[3]-val25)*val26*alu129)+val30);
  data0_100352[(alu125+64)] = (((acc0[4]-val31)*val33*alu130)+val36);
  data0_100352[(alu125+80)] = (((acc0[5]-val32)*val34*alu131)+val38);
  data0_100352[(alu125+96)] = (((acc0[6]-val39)*val41*alu132)+val44);
  data0_100352[(alu125+112)] = (((acc0[7]-val40)*val42*alu133)+val46);
  data0_100352[(alu125+3584)] = (((acc0[8]-val15)*val18*alu126)+val20);
  data0_100352[(alu125+3600)] = (((acc0[9]-val16)*val21*alu127)+val24);
  data0_100352[(alu125+3616)] = (((acc0[10]-val17)*val22*alu128)+val28);
  data0_100352[(alu125+3632)] = (((acc0[11]-val25)*val26*alu129)+val30);
  data0_100352[(alu125+3648)] = (((acc0[12]-val31)*val33*alu130)+val36);
  data0_100352[(alu125+3664)] = (((acc0[13]-val32)*val34*alu131)+val38);
  data0_100352[(alu125+3680)] = (((acc0[14]-val39)*val41*alu132)+val44);
  data0_100352[(alu125+3696)] = (((acc0[15]-val40)*val42*alu133)+val46);
  data0_100352[(alu125+7168)] = (((acc0[16]-val15)*val18*alu126)+val20);
  data0_100352[(alu125+7184)] = (((acc0[17]-val16)*val21*alu127)+val24);
  data0_100352[(alu125+7200)] = (((acc0[18]-val17)*val22*alu128)+val28);
  data0_100352[(alu125+7216)] = (((acc0[19]-val25)*val26*alu129)+val30);
  data0_100352[(alu125+7232)] = (((acc0[20]-val31)*val33*alu130)+val36);
  data0_100352[(alu125+7248)] = (((acc0[21]-val32)*val34*alu131)+val38);
  data0_100352[(alu125+7264)] = (((acc0[22]-val39)*val41*alu132)+val44);
  data0_100352[(alu125+7280)] = (((acc0[23]-val40)*val42*alu133)+val46);
  data0_100352[(alu125+10752)] = (((acc0[24]-val15)*val18*alu126)+val20);
  data0_100352[(alu125+10768)] = (((acc0[25]-val16)*val21*alu127)+val24);
  data0_100352[(alu125+10784)] = (((acc0[26]-val17)*val22*alu128)+val28);
  data0_100352[(alu125+10800)] = (((acc0[27]-val25)*val26*alu129)+val30);
  data0_100352[(alu125+10816)] = (((acc0[28]-val31)*val33*alu130)+val36);
  data0_100352[(alu125+10832)] = (((acc0[29]-val32)*val34*alu131)+val38);
  data0_100352[(alu125+10848)] = (((acc0[30]-val39)*val41*alu132)+val44);
  data0_100352[(alu125+10864)] = (((acc0[31]-val40)*val42*alu133)+val46);
  data0_100352[(alu125+14336)] = (((acc0[32]-val15)*val18*alu126)+val20);
  data0_100352[(alu125+14352)] = (((acc0[33]-val16)*val21*alu127)+val24);
  data0_100352[(alu125+14368)] = (((acc0[34]-val17)*val22*alu128)+val28);
  data0_100352[(alu125+14384)] = (((acc0[35]-val25)*val26*alu129)+val30);
  data0_100352[(alu125+14400)] = (((acc0[36]-val31)*val33*alu130)+val36);
  data0_100352[(alu125+14416)] = (((acc0[37]-val32)*val34*alu131)+val38);
  data0_100352[(alu125+14432)] = (((acc0[38]-val39)*val41*alu132)+val44);
  data0_100352[(alu125+14448)] = (((acc0[39]-val40)*val42*alu133)+val46);
  data0_100352[(alu125+17920)] = (((acc0[40]-val15)*val18*alu126)+val20);
  data0_100352[(alu125+17936)] = (((acc0[41]-val16)*val21*alu127)+val24);
  data0_100352[(alu125+17952)] = (((acc0[42]-val17)*val22*alu128)+val28);
  data0_100352[(alu125+17968)] = (((acc0[43]-val25)*val26*alu129)+val30);
  data0_100352[(alu125+17984)] = (((acc0[44]-val31)*val33*alu130)+val36);
  data0_100352[(alu125+18000)] = (((acc0[45]-val32)*val34*alu131)+val38);
  data0_100352[(alu125+18016)] = (((acc0[46]-val39)*val41*alu132)+val44);
  data0_100352[(alu125+18032)] = (((acc0[47]-val40)*val42*alu133)+val46);
  data0_100352[(alu125+21504)] = (((acc0[48]-val15)*val18*alu126)+val20);
  data0_100352[(alu125+21520)] = (((acc0[49]-val16)*val21*alu127)+val24);
  data0_100352[(alu125+21536)] = (((acc0[50]-val17)*val22*alu128)+val28);
  data0_100352[(alu125+21552)] = (((acc0[51]-val25)*val26*alu129)+val30);
  data0_100352[(alu125+21568)] = (((acc0[52]-val31)*val33*alu130)+val36);
  data0_100352[(alu125+21584)] = (((acc0[53]-val32)*val34*alu131)+val38);
  data0_100352[(alu125+21600)] = (((acc0[54]-val39)*val41*alu132)+val44);
  data0_100352[(alu125+21616)] = (((acc0[55]-val40)*val42*alu133)+val46);
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

const r_8_28_4_32_7_128_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  var acc0: array<f32,7>;
  var gidx0 = i32(gindex.x); /* 4 */
  var gidx1 = i32(gindex.y); /* 28 */
  var gidx2 = i32(gindex.z); /* 8 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx0*7);
  var alu1 = (gidx1*28);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 128; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu9 = (gidx1+Ridx1);
      var alu10 = ((0<alu9)&(alu9<29));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu11 = (alu0+Ridx2);
        var alu12 = (alu11+alu1+(Ridx1*28)+(Ridx0*784));
        var val0 = select(0.0f, data1_100352[(alu12+-29)], ((0<(gidx0+Ridx2))&alu10));
        var val1 = data2_294912[((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx2*36864)+(lidx0*1152))];
        var val2 = select(0.0f, data1_100352[(alu12+-28)], alu10);
        var val3 = select(0.0f, data1_100352[(alu12+-27)], alu10);
        var val4 = select(0.0f, data1_100352[(alu12+-26)], alu10);
        var val5 = select(0.0f, data1_100352[(alu12+-25)], alu10);
        var val6 = select(0.0f, data1_100352[(alu12+-24)], alu10);
        var val7 = select(0.0f, data1_100352[(alu12+-23)], ((alu11<23)&alu10));
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
  var alu23 = (lidx0+bitcast<i32>((bitcast<u32>(gidx2)<<5u)));
  var val8 = data3_256[alu23];
  var val9 = data4_256[alu23];
  var val10 = data5_256[alu23];
  var val11 = data6_256[alu23];
  var val12 = data7_256[alu23];
  var alu24 = (alu0+alu1+(gidx2*25088)+(lidx0*784));
  var alu25 = (1/sqrt((val10+1e-05f)));
  var alu26 = (((acc0[0]-val8)*val9*alu25)+val11);
  var alu27 = (((acc0[1]-val8)*val9*alu25)+val11);
  var alu28 = (((acc0[2]-val8)*val9*alu25)+val11);
  var alu29 = (((acc0[3]-val8)*val9*alu25)+val11);
  var alu30 = (((acc0[4]-val8)*val9*alu25)+val11);
  var alu31 = (((acc0[5]-val8)*val9*alu25)+val11);
  var alu32 = (((acc0[6]-val8)*val9*alu25)+val11);
  var alu33 = select((val12*alu26),alu26,(0.0f<alu26));
  var alu34 = select((val12*alu27),alu27,(0.0f<alu27));
  var alu35 = select((val12*alu28),alu28,(0.0f<alu28));
  var alu36 = select((val12*alu29),alu29,(0.0f<alu29));
  var alu37 = select((val12*alu30),alu30,(0.0f<alu30));
  var alu38 = select((val12*alu31),alu31,(0.0f<alu31));
  var alu39 = select((val12*alu32),alu32,(0.0f<alu32));
  data0_200704[(alu24+1)] = alu34;
  data0_200704[(alu24+2)] = alu35;
  data0_200704[(alu24+3)] = alu36;
  data0_200704[(alu24+4)] = alu37;
  data0_200704[(alu24+5)] = alu38;
  data0_200704[(alu24+6)] = alu39;
  data0_200704[alu24] = alu33;
}`;

const r_14_2_4_16_7_4_256_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  var acc0: array<f32,28>;
  var gidx0 = i32(gindex.x); /* 4 */
  var gidx1 = i32(gindex.y); /* 2 */
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
  for (var Ridx0 = 0; Ridx0 < 256; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu28 = (0<(gidx2+Ridx1));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu29 = ((gidx1*14)+Ridx2+(gidx2*56)+(Ridx1*28)+(Ridx0*784));
        var val0 = select(0.0f, data1_200704[(alu29+-29)], ((0<(gidx1+Ridx2))&alu28));
        var alu30 = ((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx0*147456)+(lidx0*2304));
        var val1 = data2_589824[alu30];
        var val2 = data2_589824[(alu30+36864)];
        var val3 = data2_589824[(alu30+73728)];
        var val4 = data2_589824[(alu30+110592)];
        var val5 = select(0.0f, data1_200704[(alu29+-27)], alu28);
        var val6 = select(0.0f, data1_200704[(alu29+-25)], alu28);
        var val7 = select(0.0f, data1_200704[(alu29+-23)], alu28);
        var val8 = select(0.0f, data1_200704[(alu29+-21)], alu28);
        var val9 = select(0.0f, data1_200704[(alu29+-19)], alu28);
        var val10 = select(0.0f, data1_200704[(alu29+-17)], alu28);
        acc0[0] = (acc0[0]+(val0*val1));
        acc0[1] = (acc0[1]+(val0*val2));
        acc0[2] = (acc0[2]+(val0*val3));
        acc0[3] = (acc0[3]+(val0*val4));
        acc0[4] = (acc0[4]+(val5*val1));
        acc0[5] = (acc0[5]+(val5*val2));
        acc0[6] = (acc0[6]+(val5*val3));
        acc0[7] = (acc0[7]+(val5*val4));
        acc0[8] = (acc0[8]+(val6*val1));
        acc0[9] = (acc0[9]+(val6*val2));
        acc0[10] = (acc0[10]+(val6*val3));
        acc0[11] = (acc0[11]+(val6*val4));
        acc0[12] = (acc0[12]+(val7*val1));
        acc0[13] = (acc0[13]+(val7*val2));
        acc0[14] = (acc0[14]+(val7*val3));
        acc0[15] = (acc0[15]+(val7*val4));
        acc0[16] = (acc0[16]+(val8*val1));
        acc0[17] = (acc0[17]+(val8*val2));
        acc0[18] = (acc0[18]+(val8*val3));
        acc0[19] = (acc0[19]+(val8*val4));
        acc0[20] = (acc0[20]+(val9*val1));
        acc0[21] = (acc0[21]+(val9*val2));
        acc0[22] = (acc0[22]+(val9*val3));
        acc0[23] = (acc0[23]+(val9*val4));
        acc0[24] = (acc0[24]+(val10*val1));
        acc0[25] = (acc0[25]+(val10*val2));
        acc0[26] = (acc0[26]+(val10*val3));
        acc0[27] = (acc0[27]+(val10*val4));
      }
    }
  }
  var alu62 = (lidx0+bitcast<i32>((bitcast<u32>(gidx0)<<6u)));
  var val11 = data3_256[alu62];
  var val12 = data4_256[alu62];
  var val13 = data5_256[alu62];
  var val14 = data6_256[alu62];
  var alu63 = (alu62+16);
  var val15 = data3_256[alu63];
  var val16 = data4_256[alu63];
  var val17 = data5_256[alu63];
  var val18 = data6_256[alu63];
  var alu64 = (alu62+32);
  var val19 = data3_256[alu64];
  var alu65 = (alu62+48);
  var val20 = data3_256[alu65];
  var val21 = data4_256[alu64];
  var val22 = data4_256[alu65];
  var val23 = data5_256[alu64];
  var val24 = data5_256[alu65];
  var val25 = data6_256[alu64];
  var val26 = data6_256[alu65];
  var alu66 = (alu62+(gidx1*1792)+(gidx2*3584));
  var alu67 = (1/sqrt((val13+1e-05f)));
  var alu68 = (1/sqrt((val17+1e-05f)));
  var alu69 = (1/sqrt((val23+1e-05f)));
  var alu70 = (1/sqrt((val24+1e-05f)));
  data0_50176[alu66] = (((acc0[0]-val11)*val12*alu67)+val14);
  data0_50176[(alu66+16)] = (((acc0[1]-val15)*val16*alu68)+val18);
  data0_50176[(alu66+32)] = (((acc0[2]-val19)*val21*alu69)+val25);
  data0_50176[(alu66+48)] = (((acc0[3]-val20)*val22*alu70)+val26);
  data0_50176[(alu66+256)] = (((acc0[4]-val11)*val12*alu67)+val14);
  data0_50176[(alu66+272)] = (((acc0[5]-val15)*val16*alu68)+val18);
  data0_50176[(alu66+288)] = (((acc0[6]-val19)*val21*alu69)+val25);
  data0_50176[(alu66+304)] = (((acc0[7]-val20)*val22*alu70)+val26);
  data0_50176[(alu66+512)] = (((acc0[8]-val11)*val12*alu67)+val14);
  data0_50176[(alu66+528)] = (((acc0[9]-val15)*val16*alu68)+val18);
  data0_50176[(alu66+544)] = (((acc0[10]-val19)*val21*alu69)+val25);
  data0_50176[(alu66+560)] = (((acc0[11]-val20)*val22*alu70)+val26);
  data0_50176[(alu66+768)] = (((acc0[12]-val11)*val12*alu67)+val14);
  data0_50176[(alu66+784)] = (((acc0[13]-val15)*val16*alu68)+val18);
  data0_50176[(alu66+800)] = (((acc0[14]-val19)*val21*alu69)+val25);
  data0_50176[(alu66+816)] = (((acc0[15]-val20)*val22*alu70)+val26);
  data0_50176[(alu66+1024)] = (((acc0[16]-val11)*val12*alu67)+val14);
  data0_50176[(alu66+1040)] = (((acc0[17]-val15)*val16*alu68)+val18);
  data0_50176[(alu66+1056)] = (((acc0[18]-val19)*val21*alu69)+val25);
  data0_50176[(alu66+1072)] = (((acc0[19]-val20)*val22*alu70)+val26);
  data0_50176[(alu66+1280)] = (((acc0[20]-val11)*val12*alu67)+val14);
  data0_50176[(alu66+1296)] = (((acc0[21]-val15)*val16*alu68)+val18);
  data0_50176[(alu66+1312)] = (((acc0[22]-val19)*val21*alu69)+val25);
  data0_50176[(alu66+1328)] = (((acc0[23]-val20)*val22*alu70)+val26);
  data0_50176[(alu66+1536)] = (((acc0[24]-val11)*val12*alu67)+val14);
  data0_50176[(alu66+1552)] = (((acc0[25]-val15)*val16*alu68)+val18);
  data0_50176[(alu66+1568)] = (((acc0[26]-val19)*val21*alu69)+val25);
  data0_50176[(alu66+1584)] = (((acc0[27]-val20)*val22*alu70)+val26);
}`;

const E_8_196_32 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_50176:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_50176:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_50176:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 196 */
  var gidx1 = i32(gindex.y); /* 8 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (lidx0+bitcast<i32>((bitcast<u32>(gidx1)<<5u))+bitcast<i32>((bitcast<u32>(gidx0)<<8u)));
  var val0 = data1_50176[alu0];
  var val1 = data2_50176[alu0];
  data0_50176[(gidx0+(gidx1*6272)+(lidx0*196))] = (val0+val1);
}`;

const E_256_28_7 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_50176:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_50176:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_256:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_256:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_256:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_256:array<f32>;
@compute @workgroup_size(1) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 28 */
  var gidx1 = i32(gindex.y); /* 256 */
  var alu0 = ((gidx0*7)+(gidx1*196));
  var val0 = data1_50176[alu0];
  var val1 = data2_256[gidx1];
  var val2 = data3_256[gidx1];
  var val3 = data4_256[gidx1];
  var val4 = data5_256[gidx1];
  var alu1 = (alu0+1);
  var val5 = data1_50176[alu1];
  var alu2 = (alu0+2);
  var val6 = data1_50176[alu2];
  var alu3 = (alu0+3);
  var val7 = data1_50176[alu3];
  var alu4 = (alu0+4);
  var val8 = data1_50176[alu4];
  var alu5 = (alu0+5);
  var val9 = data1_50176[alu5];
  var alu6 = (alu0+6);
  var val10 = data1_50176[alu6];
  var alu7 = (1/sqrt((val3+1e-05f)));
  data0_50176[alu1] = (((val5-val1)*val2*alu7)+val4);
  data0_50176[alu2] = (((val6-val1)*val2*alu7)+val4);
  data0_50176[alu3] = (((val7-val1)*val2*alu7)+val4);
  data0_50176[alu4] = (((val8-val1)*val2*alu7)+val4);
  data0_50176[alu5] = (((val9-val1)*val2*alu7)+val4);
  data0_50176[alu6] = (((val10-val1)*val2*alu7)+val4);
  data0_50176[alu0] = (((val0-val1)*val2*alu7)+val4);
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
  var alu35 = (gidx0+(gidx1*6272)+(lidx0*196));
  var val21 = data7_50176[alu35];
  var alu36 = (alu35+14);
  var val22 = data7_50176[alu36];
  var alu37 = (alu35+28);
  var val23 = data7_50176[alu37];
  var alu38 = (alu35+42);
  var val24 = data7_50176[alu38];
  var alu39 = (alu35+56);
  var val25 = data7_50176[alu39];
  var alu40 = (alu35+70);
  var val26 = data7_50176[alu40];
  var alu41 = (alu35+84);
  var val27 = data7_50176[alu41];
  var alu42 = (alu35+98);
  var val28 = data7_50176[alu42];
  var alu43 = (alu35+112);
  var val29 = data7_50176[alu43];
  var alu44 = (alu35+126);
  var val30 = data7_50176[alu44];
  var alu45 = (alu35+140);
  var val31 = data7_50176[alu45];
  var alu46 = (alu35+154);
  var val32 = data7_50176[alu46];
  var alu47 = (alu35+168);
  var val33 = data7_50176[alu47];
  var alu48 = (alu35+182);
  var val34 = data7_50176[alu48];
  var alu49 = (1/sqrt((val19+1e-05f)));
  data0_50176[alu35] = (((acc0[0]-val17)*val18*alu49)+val20+val21);
  data0_50176[alu36] = (((acc0[1]-val17)*val18*alu49)+val20+val22);
  data0_50176[alu37] = (((acc0[2]-val17)*val18*alu49)+val20+val23);
  data0_50176[alu38] = (((acc0[3]-val17)*val18*alu49)+val20+val24);
  data0_50176[alu39] = (((acc0[4]-val17)*val18*alu49)+val20+val25);
  data0_50176[alu40] = (((acc0[5]-val17)*val18*alu49)+val20+val26);
  data0_50176[alu41] = (((acc0[6]-val17)*val18*alu49)+val20+val27);
  data0_50176[alu42] = (((acc0[7]-val17)*val18*alu49)+val20+val28);
  data0_50176[alu43] = (((acc0[8]-val17)*val18*alu49)+val20+val29);
  data0_50176[alu44] = (((acc0[9]-val17)*val18*alu49)+val20+val30);
  data0_50176[alu45] = (((acc0[10]-val17)*val18*alu49)+val20+val31);
  data0_50176[alu46] = (((acc0[11]-val17)*val18*alu49)+val20+val32);
  data0_50176[alu47] = (((acc0[12]-val17)*val18*alu49)+val20+val33);
  data0_50176[alu48] = (((acc0[13]-val17)*val18*alu49)+val20+val34);
}`;

const r_7_16_16_7_2_256 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  var acc0: array<f32,14>;
  var gidx0 = i32(gindex.x); /* 16 */
  var gidx1 = i32(gindex.y); /* 7 */
  var lidx0 = i32(lindex.x); /* 16 */
  var cast0 = bitcast<u32>(gidx0);
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
    var alu14 = ((gidx1*28)+(Ridx0*196));
    var val0 = data1_50176[alu14];
    var alu15 = (bitcast<i32>((cast0<<13u))+bitcast<i32>((bitcast<u32>(lidx0)<<8u))+Ridx0);
    var val1 = data2_131072[alu15];
    var val2 = data2_131072[(alu15+4096)];
    var val3 = data1_50176[(alu14+2)];
    var val4 = data1_50176[(alu14+4)];
    var val5 = data1_50176[(alu14+6)];
    var val6 = data1_50176[(alu14+8)];
    var val7 = data1_50176[(alu14+10)];
    var val8 = data1_50176[(alu14+12)];
    acc0[0] = (acc0[0]+(val0*val1));
    acc0[1] = (acc0[1]+(val0*val2));
    acc0[2] = (acc0[2]+(val3*val1));
    acc0[3] = (acc0[3]+(val3*val2));
    acc0[4] = (acc0[4]+(val4*val1));
    acc0[5] = (acc0[5]+(val4*val2));
    acc0[6] = (acc0[6]+(val5*val1));
    acc0[7] = (acc0[7]+(val5*val2));
    acc0[8] = (acc0[8]+(val6*val1));
    acc0[9] = (acc0[9]+(val6*val2));
    acc0[10] = (acc0[10]+(val7*val1));
    acc0[11] = (acc0[11]+(val7*val2));
    acc0[12] = (acc0[12]+(val8*val1));
    acc0[13] = (acc0[13]+(val8*val2));
  }
  var alu31 = (lidx0+bitcast<i32>((cast0<<5u)));
  var val9 = data3_512[alu31];
  var alu32 = (alu31+16);
  var val10 = data3_512[alu32];
  var val11 = data4_512[alu31];
  var val12 = data4_512[alu32];
  var val13 = data5_512[alu31];
  var val14 = data6_512[alu31];
  var val15 = data5_512[alu32];
  var val16 = data6_512[alu32];
  var alu33 = (alu31+(gidx1*3584));
  var alu34 = (1/sqrt((val13+1e-05f)));
  var alu35 = (1/sqrt((val15+1e-05f)));
  data0_25088[alu33] = (((acc0[0]-val9)*val11*alu34)+val14);
  data0_25088[(alu33+16)] = (((acc0[1]-val10)*val12*alu35)+val16);
  data0_25088[(alu33+512)] = (((acc0[2]-val9)*val11*alu34)+val14);
  data0_25088[(alu33+528)] = (((acc0[3]-val10)*val12*alu35)+val16);
  data0_25088[(alu33+1024)] = (((acc0[4]-val9)*val11*alu34)+val14);
  data0_25088[(alu33+1040)] = (((acc0[5]-val10)*val12*alu35)+val16);
  data0_25088[(alu33+1536)] = (((acc0[6]-val9)*val11*alu34)+val14);
  data0_25088[(alu33+1552)] = (((acc0[7]-val10)*val12*alu35)+val16);
  data0_25088[(alu33+2048)] = (((acc0[8]-val9)*val11*alu34)+val14);
  data0_25088[(alu33+2064)] = (((acc0[9]-val10)*val12*alu35)+val16);
  data0_25088[(alu33+2560)] = (((acc0[10]-val9)*val11*alu34)+val14);
  data0_25088[(alu33+2576)] = (((acc0[11]-val10)*val12*alu35)+val16);
  data0_25088[(alu33+3072)] = (((acc0[12]-val9)*val11*alu34)+val14);
  data0_25088[(alu33+3088)] = (((acc0[13]-val10)*val12*alu35)+val16);
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
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 512; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu7 = (0<(gidx1+Ridx1));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu8 = ((gidx1*28)+(Ridx1*14)+Ridx2+(Ridx0*196));
        var val0 = select(0.0f, data1_100352[(alu8+-15)], ((0<Ridx2)&alu7));
        var val1 = data2_2359296[((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx0*73728)+(lidx0*4608))];
        var val2 = select(0.0f, data1_100352[(alu8+-13)], alu7);
        var val3 = select(0.0f, data1_100352[(alu8+-11)], alu7);
        var val4 = select(0.0f, data1_100352[(alu8+-9)], alu7);
        var val5 = select(0.0f, data1_100352[(alu8+-7)], alu7);
        var val6 = select(0.0f, data1_100352[(alu8+-5)], alu7);
        var val7 = select(0.0f, data1_100352[(alu8+-3)], alu7);
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
  var alu19 = (lidx0+bitcast<i32>((bitcast<u32>(gidx0)<<4u)));
  var val8 = data3_512[alu19];
  var val9 = data4_512[alu19];
  var val10 = data5_512[alu19];
  var val11 = data6_512[alu19];
  var alu20 = (alu19+(gidx1*3584));
  var alu21 = (1/sqrt((val10+1e-05f)));
  data0_25088[alu20] = (((acc0[0]-val8)*val9*alu21)+val11);
  data0_25088[(alu20+512)] = (((acc0[1]-val8)*val9*alu21)+val11);
  data0_25088[(alu20+1024)] = (((acc0[2]-val8)*val9*alu21)+val11);
  data0_25088[(alu20+1536)] = (((acc0[3]-val8)*val9*alu21)+val11);
  data0_25088[(alu20+2048)] = (((acc0[4]-val8)*val9*alu21)+val11);
  data0_25088[(alu20+2560)] = (((acc0[5]-val8)*val9*alu21)+val11);
  data0_25088[(alu20+3072)] = (((acc0[6]-val8)*val9*alu21)+val11);
}`;

const E_128_49_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_25088:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_25088:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_25088:array<f32>;
@compute @workgroup_size(1) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 49 */
  var gidx1 = i32(gindex.y); /* 128 */
  var alu0 = (bitcast<i32>((bitcast<u32>(gidx0)<<9u))+bitcast<i32>((bitcast<u32>(gidx1)<<2u)));
  var val0 = data1_25088[alu0];
  var alu1 = (alu0+1);
  var val1 = data1_25088[alu1];
  var alu2 = (alu0+2);
  var val2 = data1_25088[alu2];
  var alu3 = (alu0+3);
  var val3 = data1_25088[alu3];
  var val4 = data2_25088[alu0];
  var val5 = data2_25088[alu1];
  var val6 = data2_25088[alu2];
  var val7 = data2_25088[alu3];
  var alu4 = (gidx0+(gidx1*196));
  data0_25088[alu4] = (val0+val4);
  data0_25088[(alu4+49)] = (val1+val5);
  data0_25088[(alu4+98)] = (val2+val6);
  data0_25088[(alu4+147)] = (val3+val7);
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
  var alu0 = ((gidx0*7)+(gidx1*49));
  var val0 = data1_25088[alu0];
  var val1 = data2_512[gidx1];
  var val2 = data3_512[gidx1];
  var val3 = data4_512[gidx1];
  var val4 = data5_512[gidx1];
  var alu1 = (alu0+1);
  var val5 = data1_25088[alu1];
  var alu2 = (alu0+2);
  var val6 = data1_25088[alu2];
  var alu3 = (alu0+3);
  var val7 = data1_25088[alu3];
  var alu4 = (alu0+4);
  var val8 = data1_25088[alu4];
  var alu5 = (alu0+5);
  var val9 = data1_25088[alu5];
  var alu6 = (alu0+6);
  var val10 = data1_25088[alu6];
  var alu7 = (1/sqrt((val3+1e-05f)));
  data0_25088[alu1] = (((val5-val1)*val2*alu7)+val4);
  data0_25088[alu2] = (((val6-val1)*val2*alu7)+val4);
  data0_25088[alu3] = (((val7-val1)*val2*alu7)+val4);
  data0_25088[alu4] = (((val8-val1)*val2*alu7)+val4);
  data0_25088[alu5] = (((val9-val1)*val2*alu7)+val4);
  data0_25088[alu6] = (((val10-val1)*val2*alu7)+val4);
  data0_25088[alu0] = (((val0-val1)*val2*alu7)+val4);
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

const r_7_512_16_7_32_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
var<workgroup> temp0: array<f32,112>;
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
  var acc1: array<f32,7>;
  var gidx0 = i32(gindex.x); /* 512 */
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
  for (var Ridx0 = 0; Ridx0 < 32; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu8 = (gidx1+Ridx1);
      var alu9 = ((0<alu8)&(alu8<8));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu10 = (alu0+(Ridx1*7)+Ridx2+(lidx0*49)+(Ridx0*784));
        var val0 = select(0.0f, data1_25088[(alu10+-8)], ((0<Ridx2)&alu9));
        var val1 = data2_2359296[((lidx0*9)+(Ridx0*144)+(Ridx1*3)+Ridx2+(gidx0*4608))];
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
  var alu21 = (lidx0*7);
  temp0[(alu21+1)] = acc0[1];
  temp0[(alu21+2)] = acc0[2];
  temp0[(alu21+3)] = acc0[3];
  temp0[(alu21+4)] = acc0[4];
  temp0[(alu21+5)] = acc0[5];
  temp0[(alu21+6)] = acc0[6];
  temp0[alu21] = acc0[0];
  workgroupBarrier();
  acc1[0] = 0.0f;
  acc1[1] = 0.0f;
  acc1[2] = 0.0f;
  acc1[3] = 0.0f;
  acc1[4] = 0.0f;
  acc1[5] = 0.0f;
  acc1[6] = 0.0f;
  for (var Ridx106 = 0; Ridx106 < 16; Ridx106++) {
    var alu37 = (Ridx106*7);
    var val8 = temp0[(alu37+1)];
    var val9 = temp0[alu37];
    var val10 = temp0[(alu37+2)];
    var val11 = temp0[(alu37+3)];
    var val12 = temp0[(alu37+4)];
    var val13 = temp0[(alu37+5)];
    var val14 = temp0[(alu37+6)];
    acc1[0] = (acc1[0]+val9);
    acc1[1] = (acc1[1]+val8);
    acc1[2] = (acc1[2]+val10);
    acc1[3] = (acc1[3]+val11);
    acc1[4] = (acc1[4]+val12);
    acc1[5] = (acc1[5]+val13);
    acc1[6] = (acc1[6]+val14);
  }
  var val15 = data3_512[gidx0];
  var val16 = data4_512[gidx0];
  var val17 = data5_512[gidx0];
  var val18 = data6_512[gidx0];
  var alu46 = ((gidx0*49)+alu0);
  var val19 = data7_25088[alu46];
  var val20 = data7_25088[(alu46+1)];
  var val21 = data7_25088[(alu46+2)];
  var val22 = data7_25088[(alu46+3)];
  var val23 = data7_25088[(alu46+4)];
  var val24 = data7_25088[(alu46+5)];
  var val25 = data7_25088[(alu46+6)];
  var alu47 = (gidx0+(gidx1*3584));
  var alu48 = (lidx0==0);
  var alu49 = (1/sqrt((val17+1e-05f)));
  if (alu48) {
    data0_25088[alu47] = (((acc1[0]-val15)*val16*alu49)+val18+val19);
  }
  if (alu48) {
    data0_25088[(alu47+512)] = (((acc1[1]-val15)*val16*alu49)+val18+val20);
  }
  if (alu48) {
    data0_25088[(alu47+1024)] = (((acc1[2]-val15)*val16*alu49)+val18+val21);
  }
  if (alu48) {
    data0_25088[(alu47+1536)] = (((acc1[3]-val15)*val16*alu49)+val18+val22);
  }
  if (alu48) {
    data0_25088[(alu47+2048)] = (((acc1[4]-val15)*val16*alu49)+val18+val23);
  }
  if (alu48) {
    data0_25088[(alu47+2560)] = (((acc1[5]-val15)*val16*alu49)+val18+val24);
  }
  if (alu48) {
    data0_25088[(alu47+3072)] = (((acc1[6]-val15)*val16*alu49)+val18+val25);
  }
}`;

const E_512_7_7n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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

const r_512_16_1568 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
var<workgroup> temp0: array<f32,16>;
@group(0) @binding(1)var<storage,read_write>data0_512:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_25088:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_12845056:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_512:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_512:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_512:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,1>;
  var acc1: array<f32,1>;
  var gidx0 = i32(gindex.x); /* 512 */
  var lidx0 = i32(lindex.x); /* 16 */
  acc0[0] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 1568; Ridx0++) {
    var alu1 = (lidx0+bitcast<i32>((bitcast<u32>(Ridx0)<<4u)));
    var val0 = data1_25088[alu1];
    var val1 = data2_12845056[(alu1+(gidx0*25088))];
    acc0[0] = (acc0[0]+(val0*val1));
  }
  temp0[lidx0] = acc0[0];
  workgroupBarrier();
  acc1[0] = 0.0f;
  for (var Ridx102 = 0; Ridx102 < 16; Ridx102++) {
    var val2 = temp0[Ridx102];
    acc1[0] = (acc1[0]+val2);
  }
  var val3 = data3_512[gidx0];
  var val4 = data4_512[gidx0];
  var val5 = data5_512[gidx0];
  var alu9 = (lidx0==0);
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

    const kernels = [r_2_28_7_16_4_4_4_2_3_3_3, E_256_2, E_64_784_16, r_2_8_56_32_7_2_2_64_3_3, r_2_28_8_32_7_2_64_3_3, E_64_392_8, r_7_14_32_2_4_4_2_64_3_3, r_2_8_56_32_7_64_3_3, E_64_392_8, r_7_14_32_2_4_4_2_64_3_3, r_2_8_56_32_7_64_3_3, E_64_392_8, r_28_4_8_16_7_64, r_4_56_32_7_8_64_3_3, r_4_14_16_2_7_8_128_3_3, E_128_98_8, E_128_49_16, r_4_4_28_32_7_128_3_3, r_4_4_28_32_7_128_3_3n1, E_128_49_16, r_4_4_28_32_7_128_3_3, r_4_4_28_32_7_128_3_3n1, E_128_49_16, r_4_4_28_32_7_128_3_3, r_4_4_28_32_7_128_3_3n1, E_128_49_16, r_14_16_16_14_128, r_8_28_4_32_7_128_3_3, r_14_2_4_16_7_4_256_3_3, E_8_196_32, E_256_28_7, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_256_28_7, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_256_28_7, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_256_28_7, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_256_28_7, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_256_28_7, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_256_28_7, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_256_28_7, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_256_28_7, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_256_28_7, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_256_28_7, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_256_28_7, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_256_28_7, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_256_28_7, r_7_16_16_7_2_256, r_16_14_32_14_256_3_3, r_7_32_16_7_512_3_3, E_128_49_4, E_512_7_7, r_16_7_32_7_512_3_3, r_16_7_32_7_512_3_3n1, E_512_7_7, r_16_7_32_7_512_3_3, r_7_512_16_7_32_3_3, E_512_7_7n1, r_512_16_1568, r_128_4, E_256_2n1];
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
        addComputePass(device, commandEncoder, pipelines[0], layouts[0], infinityBuf, [buf_0, input0, buf_1, buf_2, buf_3, buf_4, buf_5, buf_6], [7, 28, 2]);
        addComputePass(device, commandEncoder, pipelines[1], layouts[1], infinityBuf, [buf_7, buf_8], [256, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[2], layouts[2], infinityBuf, [buf_9, buf_0, buf_10, buf_11, buf_12, buf_13], [784, 64, 1]);
        addComputePass(device, commandEncoder, pipelines[3], layouts[3], infinityBuf, [buf_14, buf_9, buf_15, buf_16, buf_17, buf_18, buf_19, buf_20], [56, 8, 2]);
        addComputePass(device, commandEncoder, pipelines[4], layouts[4], infinityBuf, [buf_21, buf_14, buf_22, buf_23, buf_24, buf_25, buf_26, buf_0], [8, 28, 2]);
        addComputePass(device, commandEncoder, pipelines[5], layouts[5], infinityBuf, [buf_27, buf_21, buf_28, buf_29, buf_30, buf_31], [392, 64, 1]);
        addComputePass(device, commandEncoder, pipelines[6], layouts[6], infinityBuf, [buf_32, buf_27, buf_33, buf_34, buf_35, buf_36, buf_37, buf_38], [14, 7, 1]);
        addComputePass(device, commandEncoder, pipelines[7], layouts[7], infinityBuf, [buf_27, buf_32, buf_39, buf_40, buf_41, buf_42, buf_43, buf_21], [56, 8, 2]);
        addComputePass(device, commandEncoder, pipelines[8], layouts[8], infinityBuf, [buf_32, buf_27, buf_44, buf_45, buf_46, buf_47], [392, 64, 1]);
        addComputePass(device, commandEncoder, pipelines[9], layouts[9], infinityBuf, [buf_21, buf_32, buf_48, buf_49, buf_50, buf_51, buf_52, buf_53], [14, 7, 1]);
        addComputePass(device, commandEncoder, pipelines[10], layouts[10], infinityBuf, [buf_32, buf_21, buf_54, buf_55, buf_56, buf_57, buf_58, buf_27], [56, 8, 2]);
        addComputePass(device, commandEncoder, pipelines[11], layouts[11], infinityBuf, [buf_21, buf_32, buf_59, buf_60, buf_61, buf_62], [392, 64, 1]);
        addComputePass(device, commandEncoder, pipelines[12], layouts[12], infinityBuf, [buf_63, buf_32, buf_64, buf_65, buf_66, buf_67, buf_68], [8, 4, 28]);
        addComputePass(device, commandEncoder, pipelines[13], layouts[13], infinityBuf, [buf_69, buf_21, buf_70, buf_71, buf_72, buf_73, buf_74, buf_75], [56, 4, 1]);
        addComputePass(device, commandEncoder, pipelines[14], layouts[14], infinityBuf, [buf_76, buf_69, buf_77, buf_78, buf_79, buf_80, buf_81], [14, 4, 1]);
        addComputePass(device, commandEncoder, pipelines[15], layouts[15], infinityBuf, [buf_82, buf_76, buf_63], [98, 128, 1]);
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
        addComputePass(device, commandEncoder, pipelines[27], layouts[27], infinityBuf, [buf_21, buf_76, buf_138, buf_139, buf_140, buf_141, buf_142, buf_143], [4, 28, 8]);
        addComputePass(device, commandEncoder, pipelines[28], layouts[28], infinityBuf, [buf_144, buf_21, buf_145, buf_146, buf_147, buf_148, buf_149], [4, 2, 14]);
        addComputePass(device, commandEncoder, pipelines[29], layouts[29], infinityBuf, [buf_150, buf_144, buf_132], [196, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[30], layouts[30], infinityBuf, [buf_144, buf_150, buf_151, buf_152, buf_153, buf_154], [28, 256, 1]);
        addComputePass(device, commandEncoder, pipelines[31], layouts[31], infinityBuf, [buf_132, buf_144, buf_155, buf_156, buf_157, buf_158, buf_159, buf_160], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[32], layouts[32], infinityBuf, [buf_144, buf_132, buf_161, buf_162, buf_163, buf_164, buf_165, buf_150], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[33], layouts[33], infinityBuf, [buf_132, buf_144, buf_166, buf_167, buf_168, buf_169], [28, 256, 1]);
        addComputePass(device, commandEncoder, pipelines[34], layouts[34], infinityBuf, [buf_150, buf_132, buf_170, buf_171, buf_172, buf_173, buf_174, buf_175], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[35], layouts[35], infinityBuf, [buf_132, buf_150, buf_176, buf_177, buf_178, buf_179, buf_180, buf_144], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[36], layouts[36], infinityBuf, [buf_150, buf_132, buf_181, buf_182, buf_183, buf_184], [28, 256, 1]);
        addComputePass(device, commandEncoder, pipelines[37], layouts[37], infinityBuf, [buf_144, buf_150, buf_185, buf_186, buf_187, buf_188, buf_189, buf_190], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[38], layouts[38], infinityBuf, [buf_150, buf_144, buf_191, buf_192, buf_193, buf_194, buf_195, buf_132], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[39], layouts[39], infinityBuf, [buf_144, buf_150, buf_196, buf_197, buf_198, buf_199], [28, 256, 1]);
        addComputePass(device, commandEncoder, pipelines[40], layouts[40], infinityBuf, [buf_132, buf_144, buf_200, buf_201, buf_202, buf_203, buf_204, buf_205], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[41], layouts[41], infinityBuf, [buf_144, buf_132, buf_206, buf_207, buf_208, buf_209, buf_210, buf_150], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[42], layouts[42], infinityBuf, [buf_132, buf_144, buf_211, buf_212, buf_213, buf_214], [28, 256, 1]);
        addComputePass(device, commandEncoder, pipelines[43], layouts[43], infinityBuf, [buf_150, buf_132, buf_215, buf_216, buf_217, buf_218, buf_219, buf_220], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[44], layouts[44], infinityBuf, [buf_132, buf_150, buf_221, buf_222, buf_223, buf_224, buf_225, buf_144], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[45], layouts[45], infinityBuf, [buf_150, buf_132, buf_226, buf_227, buf_228, buf_229], [28, 256, 1]);
        addComputePass(device, commandEncoder, pipelines[46], layouts[46], infinityBuf, [buf_144, buf_150, buf_230, buf_231, buf_232, buf_233, buf_234, buf_235], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[47], layouts[47], infinityBuf, [buf_150, buf_144, buf_236, buf_237, buf_238, buf_239, buf_240, buf_132], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[48], layouts[48], infinityBuf, [buf_144, buf_150, buf_241, buf_242, buf_243, buf_244], [28, 256, 1]);
        addComputePass(device, commandEncoder, pipelines[49], layouts[49], infinityBuf, [buf_132, buf_144, buf_245, buf_246, buf_247, buf_248, buf_249, buf_250], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[50], layouts[50], infinityBuf, [buf_144, buf_132, buf_251, buf_252, buf_253, buf_254, buf_255, buf_150], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[51], layouts[51], infinityBuf, [buf_132, buf_144, buf_256, buf_257, buf_258, buf_259], [28, 256, 1]);
        addComputePass(device, commandEncoder, pipelines[52], layouts[52], infinityBuf, [buf_150, buf_132, buf_260, buf_261, buf_262, buf_263, buf_264, buf_265], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[53], layouts[53], infinityBuf, [buf_132, buf_150, buf_266, buf_267, buf_268, buf_269, buf_270, buf_144], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[54], layouts[54], infinityBuf, [buf_150, buf_132, buf_271, buf_272, buf_273, buf_274], [28, 256, 1]);
        addComputePass(device, commandEncoder, pipelines[55], layouts[55], infinityBuf, [buf_144, buf_150, buf_275, buf_276, buf_277, buf_278, buf_279, buf_280], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[56], layouts[56], infinityBuf, [buf_150, buf_144, buf_281, buf_282, buf_283, buf_284, buf_285, buf_132], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[57], layouts[57], infinityBuf, [buf_144, buf_150, buf_286, buf_287, buf_288, buf_289], [28, 256, 1]);
        addComputePass(device, commandEncoder, pipelines[58], layouts[58], infinityBuf, [buf_132, buf_144, buf_290, buf_291, buf_292, buf_293, buf_294, buf_295], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[59], layouts[59], infinityBuf, [buf_144, buf_132, buf_296, buf_297, buf_298, buf_299, buf_300, buf_150], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[60], layouts[60], infinityBuf, [buf_132, buf_144, buf_301, buf_302, buf_303, buf_304], [28, 256, 1]);
        addComputePass(device, commandEncoder, pipelines[61], layouts[61], infinityBuf, [buf_150, buf_132, buf_305, buf_306, buf_307, buf_308, buf_309, buf_310], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[62], layouts[62], infinityBuf, [buf_132, buf_150, buf_311, buf_312, buf_313, buf_314, buf_315, buf_144], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[63], layouts[63], infinityBuf, [buf_150, buf_132, buf_316, buf_317, buf_318, buf_319], [28, 256, 1]);
        addComputePass(device, commandEncoder, pipelines[64], layouts[64], infinityBuf, [buf_144, buf_150, buf_320, buf_321, buf_322, buf_323, buf_324, buf_325], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[65], layouts[65], infinityBuf, [buf_150, buf_144, buf_326, buf_327, buf_328, buf_329, buf_330, buf_132], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[66], layouts[66], infinityBuf, [buf_144, buf_150, buf_331, buf_332, buf_333, buf_334], [28, 256, 1]);
        addComputePass(device, commandEncoder, pipelines[67], layouts[67], infinityBuf, [buf_132, buf_144, buf_335, buf_336, buf_337, buf_338, buf_339, buf_340], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[68], layouts[68], infinityBuf, [buf_144, buf_132, buf_341, buf_342, buf_343, buf_344, buf_345, buf_150], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[69], layouts[69], infinityBuf, [buf_132, buf_144, buf_346, buf_347, buf_348, buf_349], [28, 256, 1]);
        addComputePass(device, commandEncoder, pipelines[70], layouts[70], infinityBuf, [buf_350, buf_144, buf_351, buf_352, buf_353, buf_354, buf_355], [16, 7, 1]);
        addComputePass(device, commandEncoder, pipelines[71], layouts[71], infinityBuf, [buf_76, buf_132, buf_356, buf_357, buf_358, buf_359, buf_360, buf_361], [14, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[72], layouts[72], infinityBuf, [buf_362, buf_76, buf_363, buf_364, buf_365, buf_366, buf_367], [32, 7, 1]);
        addComputePass(device, commandEncoder, pipelines[73], layouts[73], infinityBuf, [buf_368, buf_362, buf_350], [49, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[74], layouts[74], infinityBuf, [buf_362, buf_368, buf_369, buf_370, buf_371, buf_372], [7, 512, 1]);
        addComputePass(device, commandEncoder, pipelines[75], layouts[75], infinityBuf, [buf_350, buf_362, buf_373, buf_374, buf_375, buf_376, buf_377, buf_378], [7, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[76], layouts[76], infinityBuf, [buf_362, buf_350, buf_379, buf_380, buf_381, buf_382, buf_383, buf_368], [7, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[77], layouts[77], infinityBuf, [buf_350, buf_362, buf_384, buf_385, buf_386, buf_387], [7, 512, 1]);
        addComputePass(device, commandEncoder, pipelines[78], layouts[78], infinityBuf, [buf_368, buf_350, buf_388, buf_389, buf_390, buf_391, buf_392, buf_393], [7, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[79], layouts[79], infinityBuf, [buf_350, buf_368, buf_394, buf_395, buf_396, buf_397, buf_398, buf_362], [512, 7, 1]);
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
