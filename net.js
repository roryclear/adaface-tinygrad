
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

const r_4_112_16_2_2_7_4_3_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
@compute @workgroup_size(16,2,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,28>;
  var gidx0 = i32(gindex.x); /* 112 */
  var gidx1 = i32(gindex.y); /* 4 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 2 */
  var lidx2 = i32(lindex.z); /* 2 */
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
  for (var Ridx0 = 0; Ridx0 < 3; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu28 = (gidx0+Ridx1);
      var alu29 = ((0<alu28)&(alu28<113));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu30 = (lidx0+Ridx2);
        var alu31 = ((((lidx0*3)+(Ridx2*3))-Ridx0)+(gidx0*336)+(Ridx1*336));
        var alu32 = (alu31+-337);
        var alu33 = select(0,3,(alu32<0));
        var alu34 = (0<alu30);
        var val0 = select(0u, atomicLoad(&data1_37632[((alu32+alu33)>>2u)]), (alu34&alu29));
        var alu35 = (alu31+-289);
        var alu36 = select(0,3,(alu35<0));
        var val1 = select(0u, atomicLoad(&data1_37632[((alu35+alu36)>>2u)]), alu29);
        var alu37 = (alu31+-241);
        var alu38 = select(0,3,(alu37<0));
        var val2 = select(0u, atomicLoad(&data1_37632[((alu37+alu38)>>2u)]), alu29);
        var alu39 = (alu31+-193);
        var alu40 = select(0,3,(alu39<0));
        var val3 = select(0u, atomicLoad(&data1_37632[((alu39+alu40)>>2u)]), alu29);
        var alu41 = (alu31+-145);
        var alu42 = select(0,3,(alu41<0));
        var val4 = select(0u, atomicLoad(&data1_37632[((alu41+alu42)>>2u)]), alu29);
        var alu43 = (alu31+-97);
        var alu44 = select(0,3,(alu43<0));
        var val5 = select(0u, atomicLoad(&data1_37632[((alu43+alu44)>>2u)]), alu29);
        var alu45 = (alu31+-49);
        var alu46 = select(0,3,(alu45<0));
        var alu47 = (alu30<17);
        var val6 = select(0u, atomicLoad(&data1_37632[((alu45+alu46)>>2u)]), (alu47&alu29));
        var alu48 = ((gidx1*432)+(lidx2*216)+(lidx1*108)+(Ridx1*3)+Ridx2+(Ridx0*9));
        var val7 = data2_1728[alu48];
        var val8 = data2_1728[(alu48+27)];
        var val9 = data2_1728[(alu48+54)];
        var val10 = data2_1728[(alu48+81)];
        var alu49 = select(0.0f,((((f32((u32(((val0>>(((u32(alu32))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),(alu29&alu34));
        var alu50 = select(0.0f,((((f32((u32(((val1>>(((u32(alu35))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),alu29);
        var alu51 = select(0.0f,((((f32((u32(((val2>>(((u32(alu37))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),alu29);
        var alu52 = select(0.0f,((((f32((u32(((val3>>(((u32(alu39))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),alu29);
        var alu53 = select(0.0f,((((f32((u32(((val4>>(((u32(alu41))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),alu29);
        var alu54 = select(0.0f,((((f32((u32(((val5>>(((u32(alu43))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),alu29);
        var alu55 = select(0.0f,((((f32((u32(((val6>>(((u32(alu45))&3u)<<3u))&255u)))))*0.00392156862745098f)+-0.5f)*2.0f),(alu29&alu47));
        acc0[0] = (acc0[0]+(alu49*val7));
        acc0[1] = (acc0[1]+(alu49*val8));
        acc0[2] = (acc0[2]+(alu49*val9));
        acc0[3] = (acc0[3]+(alu49*val10));
        acc0[4] = (acc0[4]+(alu50*val7));
        acc0[5] = (acc0[5]+(alu50*val8));
        acc0[6] = (acc0[6]+(alu50*val9));
        acc0[7] = (acc0[7]+(alu50*val10));
        acc0[8] = (acc0[8]+(alu51*val7));
        acc0[9] = (acc0[9]+(alu51*val8));
        acc0[10] = (acc0[10]+(alu51*val9));
        acc0[11] = (acc0[11]+(alu51*val10));
        acc0[12] = (acc0[12]+(alu52*val7));
        acc0[13] = (acc0[13]+(alu52*val8));
        acc0[14] = (acc0[14]+(alu52*val9));
        acc0[15] = (acc0[15]+(alu52*val10));
        acc0[16] = (acc0[16]+(alu53*val7));
        acc0[17] = (acc0[17]+(alu53*val8));
        acc0[18] = (acc0[18]+(alu53*val9));
        acc0[19] = (acc0[19]+(alu53*val10));
        acc0[20] = (acc0[20]+(alu54*val7));
        acc0[21] = (acc0[21]+(alu54*val8));
        acc0[22] = (acc0[22]+(alu54*val9));
        acc0[23] = (acc0[23]+(alu54*val10));
        acc0[24] = (acc0[24]+(alu55*val7));
        acc0[25] = (acc0[25]+(alu55*val8));
        acc0[26] = (acc0[26]+(alu55*val9));
        acc0[27] = (acc0[27]+(alu55*val10));
      }
    }
  }
  var alu87 = (bitcast<i32>((bitcast<u32>(gidx1)<<4u))+bitcast<i32>((bitcast<u32>(lidx2)<<3u))+bitcast<i32>((bitcast<u32>(lidx1)<<2u)));
  var val11 = data3_64[alu87];
  var val12 = data4_64[alu87];
  var val13 = data5_64[alu87];
  var val14 = data6_64[alu87];
  var val15 = data7_64[alu87];
  var alu88 = (alu87+1);
  var val16 = data3_64[alu88];
  var alu89 = (alu87+2);
  var val17 = data3_64[alu89];
  var val18 = data4_64[alu88];
  var val19 = data4_64[alu89];
  var val20 = data5_64[alu88];
  var val21 = data5_64[alu89];
  var val22 = data6_64[alu88];
  var val23 = data6_64[alu89];
  var val24 = data7_64[alu88];
  var val25 = data7_64[alu89];
  var alu90 = (alu87+3);
  var val26 = data3_64[alu90];
  var val27 = data4_64[alu90];
  var val28 = data5_64[alu90];
  var val29 = data6_64[alu90];
  var val30 = data7_64[alu90];
  var alu91 = (lidx0+(gidx0*112)+(gidx1*200704)+(lidx2*100352)+(lidx1*50176));
  var alu92 = (1/sqrt((val13+1e-05f)));
  var alu93 = (1/sqrt((val20+1e-05f)));
  var alu94 = (1/sqrt((val21+1e-05f)));
  var alu95 = (1/sqrt((val28+1e-05f)));
  var alu96 = (((acc0[0]-val11)*val12*alu92)+val14);
  var alu97 = (((acc0[1]-val16)*val18*alu93)+val22);
  var alu98 = (((acc0[2]-val17)*val19*alu94)+val23);
  var alu99 = (((acc0[3]-val26)*val27*alu95)+val29);
  var alu100 = (((acc0[4]-val11)*val12*alu92)+val14);
  var alu101 = (((acc0[5]-val16)*val18*alu93)+val22);
  var alu102 = (((acc0[6]-val17)*val19*alu94)+val23);
  var alu103 = (((acc0[7]-val26)*val27*alu95)+val29);
  var alu104 = (((acc0[8]-val11)*val12*alu92)+val14);
  var alu105 = (((acc0[9]-val16)*val18*alu93)+val22);
  var alu106 = (((acc0[10]-val17)*val19*alu94)+val23);
  var alu107 = (((acc0[11]-val26)*val27*alu95)+val29);
  var alu108 = (((acc0[12]-val11)*val12*alu92)+val14);
  var alu109 = (((acc0[13]-val16)*val18*alu93)+val22);
  var alu110 = (((acc0[14]-val17)*val19*alu94)+val23);
  var alu111 = (((acc0[15]-val26)*val27*alu95)+val29);
  var alu112 = (((acc0[16]-val11)*val12*alu92)+val14);
  var alu113 = (((acc0[17]-val16)*val18*alu93)+val22);
  var alu114 = (((acc0[18]-val17)*val19*alu94)+val23);
  var alu115 = (((acc0[19]-val26)*val27*alu95)+val29);
  var alu116 = (((acc0[20]-val11)*val12*alu92)+val14);
  var alu117 = (((acc0[21]-val16)*val18*alu93)+val22);
  var alu118 = (((acc0[22]-val17)*val19*alu94)+val23);
  var alu119 = (((acc0[23]-val26)*val27*alu95)+val29);
  var alu120 = (((acc0[24]-val11)*val12*alu92)+val14);
  var alu121 = (((acc0[25]-val16)*val18*alu93)+val22);
  var alu122 = (((acc0[26]-val17)*val19*alu94)+val23);
  var alu123 = (((acc0[27]-val26)*val27*alu95)+val29);
  var alu124 = select((val15*alu96),alu96,(0.0f<alu96));
  var alu125 = select((val24*alu97),alu97,(0.0f<alu97));
  var alu126 = select((val25*alu98),alu98,(0.0f<alu98));
  var alu127 = select((val30*alu99),alu99,(0.0f<alu99));
  var alu128 = select((val15*alu100),alu100,(0.0f<alu100));
  var alu129 = select((val24*alu101),alu101,(0.0f<alu101));
  var alu130 = select((val25*alu102),alu102,(0.0f<alu102));
  var alu131 = select((val30*alu103),alu103,(0.0f<alu103));
  var alu132 = select((val15*alu104),alu104,(0.0f<alu104));
  var alu133 = select((val24*alu105),alu105,(0.0f<alu105));
  var alu134 = select((val25*alu106),alu106,(0.0f<alu106));
  var alu135 = select((val30*alu107),alu107,(0.0f<alu107));
  var alu136 = select((val15*alu108),alu108,(0.0f<alu108));
  var alu137 = select((val24*alu109),alu109,(0.0f<alu109));
  var alu138 = select((val25*alu110),alu110,(0.0f<alu110));
  var alu139 = select((val30*alu111),alu111,(0.0f<alu111));
  var alu140 = select((val15*alu112),alu112,(0.0f<alu112));
  var alu141 = select((val24*alu113),alu113,(0.0f<alu113));
  var alu142 = select((val25*alu114),alu114,(0.0f<alu114));
  var alu143 = select((val30*alu115),alu115,(0.0f<alu115));
  var alu144 = select((val15*alu116),alu116,(0.0f<alu116));
  var alu145 = select((val24*alu117),alu117,(0.0f<alu117));
  var alu146 = select((val25*alu118),alu118,(0.0f<alu118));
  var alu147 = select((val30*alu119),alu119,(0.0f<alu119));
  var alu148 = select((val15*alu120),alu120,(0.0f<alu120));
  var alu149 = select((val24*alu121),alu121,(0.0f<alu121));
  var alu150 = select((val25*alu122),alu122,(0.0f<alu122));
  var alu151 = select((val30*alu123),alu123,(0.0f<alu123));
  data0_802816[alu91] = alu124;
  data0_802816[(alu91+16)] = alu128;
  data0_802816[(alu91+32)] = alu132;
  data0_802816[(alu91+48)] = alu136;
  data0_802816[(alu91+64)] = alu140;
  data0_802816[(alu91+80)] = alu144;
  data0_802816[(alu91+96)] = alu148;
  data0_802816[(alu91+12544)] = alu125;
  data0_802816[(alu91+12560)] = alu129;
  data0_802816[(alu91+12576)] = alu133;
  data0_802816[(alu91+12592)] = alu137;
  data0_802816[(alu91+12608)] = alu141;
  data0_802816[(alu91+12624)] = alu145;
  data0_802816[(alu91+12640)] = alu149;
  data0_802816[(alu91+25088)] = alu126;
  data0_802816[(alu91+25104)] = alu130;
  data0_802816[(alu91+25120)] = alu134;
  data0_802816[(alu91+25136)] = alu138;
  data0_802816[(alu91+25152)] = alu142;
  data0_802816[(alu91+25168)] = alu146;
  data0_802816[(alu91+25184)] = alu150;
  data0_802816[(alu91+37632)] = alu127;
  data0_802816[(alu91+37648)] = alu131;
  data0_802816[(alu91+37664)] = alu135;
  data0_802816[(alu91+37680)] = alu139;
  data0_802816[(alu91+37696)] = alu143;
  data0_802816[(alu91+37712)] = alu147;
  data0_802816[(alu91+37728)] = alu151;
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

const E_16_784_16_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  var gidx1 = i32(gindex.y); /* 16 */
  var lidx0 = i32(lindex.x); /* 16 */
  var alu0 = (lidx0+bitcast<i32>((bitcast<u32>(gidx0)<<4u))+(gidx1*50176));
  var val0 = data1_802816[alu0];
  var cast0 = bitcast<i32>((bitcast<u32>(gidx1)<<2u));
  var val1 = data2_64[cast0];
  var alu1 = (cast0+3);
  var val2 = data2_64[alu1];
  var val3 = data3_64[cast0];
  var val4 = data3_64[alu1];
  var val5 = data4_64[cast0];
  var alu2 = (cast0+1);
  var val6 = data4_64[alu2];
  var val7 = data5_64[cast0];
  var alu3 = (alu0+12544);
  var val8 = data1_802816[alu3];
  var val9 = data2_64[alu2];
  var val10 = data3_64[alu2];
  var val11 = data5_64[alu2];
  var alu4 = (alu0+25088);
  var val12 = data1_802816[alu4];
  var alu5 = (cast0+2);
  var val13 = data2_64[alu5];
  var val14 = data3_64[alu5];
  var val15 = data4_64[alu5];
  var val16 = data5_64[alu5];
  var alu6 = (alu0+37632);
  var val17 = data1_802816[alu6];
  var val18 = data4_64[alu1];
  var val19 = data5_64[alu1];
  data0_802816[alu0] = (((val0-val1)*val3*(1/sqrt((val5+1e-05f))))+val7);
  data0_802816[alu3] = (((val8-val9)*val10*(1/sqrt((val6+1e-05f))))+val11);
  data0_802816[alu4] = (((val12-val13)*val14*(1/sqrt((val15+1e-05f))))+val16);
  data0_802816[alu6] = (((val17-val2)*val4*(1/sqrt((val18+1e-05f))))+val19);
}`;

const r_2_16_28_32_7_2_2_64_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  var gidx0 = i32(gindex.x); /* 28 */
  var gidx1 = i32(gindex.y); /* 16 */
  var gidx2 = i32(gindex.z); /* 2 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (bitcast<i32>((bitcast<u32>(gidx0)<<2u))+(gidx1*784));
  var alu1 = (gidx0<27);
  var alu2 = (gidx1<15);
  var alu3 = (0<gidx0);
  var alu4 = (0<gidx1);
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
    var alu33 = (alu0+(Ridx0*12544));
    var val0 = select(0.0f, data1_802816[(alu33+-113)], (alu3&alu4));
    var alu34 = ((gidx2*18432)+(lidx0*576)+(Ridx0*9));
    var val1 = data2_36864[(alu34+1)];
    var val2 = data2_36864[(alu34+2)];
    var val3 = data2_36864[alu34];
    var val4 = data1_802816[alu33];
    var val5 = select(0.0f, data1_802816[(alu33+-112)], alu4);
    var val6 = select(0.0f, data1_802816[(alu33+-111)], alu4);
    var val7 = select(0.0f, data1_802816[(alu33+-1)], alu3);
    var val8 = data2_36864[(alu34+3)];
    var val9 = data2_36864[(alu34+4)];
    var val10 = select(0.0f, data1_802816[(alu33+-110)], alu4);
    var val11 = select(0.0f, data1_802816[(alu33+-109)], alu4);
    var val12 = data1_802816[(alu33+1)];
    var val13 = data2_36864[(alu34+5)];
    var val14 = select(0.0f, data1_802816[(alu33+111)], alu3);
    var val15 = data2_36864[(alu34+6)];
    var val16 = data1_802816[(alu33+112)];
    var val17 = data2_36864[(alu34+7)];
    var val18 = data1_802816[(alu33+113)];
    var val19 = data2_36864[(alu34+8)];
    var val20 = data1_802816[(alu33+2)];
    var val21 = data1_802816[(alu33+3)];
    var val22 = data1_802816[(alu33+114)];
    var val23 = data1_802816[(alu33+115)];
    var val24 = select(0.0f, data1_802816[(alu33+-108)], (alu1&alu4));
    var val25 = select(0.0f, data1_802816[(alu33+4)], alu1);
    var val26 = select(0.0f, data1_802816[(alu33+116)], alu1);
    var val27 = select(0.0f, data1_802816[(alu33+223)], alu3);
    var val28 = data1_802816[(alu33+224)];
    var val29 = data1_802816[(alu33+225)];
    var val30 = data1_802816[(alu33+226)];
    var val31 = data1_802816[(alu33+227)];
    var val32 = select(0.0f, data1_802816[(alu33+228)], alu1);
    var val33 = select(0.0f, data1_802816[(alu33+335)], alu3);
    var val34 = data1_802816[(alu33+336)];
    var val35 = data1_802816[(alu33+337)];
    var val36 = data1_802816[(alu33+338)];
    var val37 = data1_802816[(alu33+339)];
    var val38 = select(0.0f, data1_802816[(alu33+340)], alu1);
    var val39 = select(0.0f, data1_802816[(alu33+447)], alu3);
    var val40 = data1_802816[(alu33+448)];
    var val41 = data1_802816[(alu33+449)];
    var val42 = data1_802816[(alu33+450)];
    var val43 = data1_802816[(alu33+451)];
    var val44 = select(0.0f, data1_802816[(alu33+452)], alu1);
    var val45 = select(0.0f, data1_802816[(alu33+559)], alu3);
    var val46 = data1_802816[(alu33+560)];
    var val47 = data1_802816[(alu33+561)];
    var val48 = data1_802816[(alu33+562)];
    var val49 = data1_802816[(alu33+563)];
    var val50 = select(0.0f, data1_802816[(alu33+564)], alu1);
    var val51 = select(0.0f, data1_802816[(alu33+671)], alu3);
    var val52 = data1_802816[(alu33+672)];
    var val53 = data1_802816[(alu33+673)];
    var val54 = data1_802816[(alu33+674)];
    var val55 = data1_802816[(alu33+675)];
    var val56 = select(0.0f, data1_802816[(alu33+676)], alu1);
    var val57 = select(0.0f, data1_802816[(alu33+783)], (alu3&alu2));
    var val58 = select(0.0f, data1_802816[(alu33+784)], alu2);
    var val59 = select(0.0f, data1_802816[(alu33+785)], alu2);
    var val60 = select(0.0f, data1_802816[(alu33+786)], alu2);
    var val61 = select(0.0f, data1_802816[(alu33+787)], alu2);
    var val62 = select(0.0f, data1_802816[(alu33+788)], (alu1&alu2));
    acc0[0] = (acc0[0]+(val0*val3)+(val5*val1)+(val6*val2)+(val7*val8)+(val4*val9)+(val12*val13)+(val14*val15)+(val16*val17)+(val18*val19));
    acc0[1] = (acc0[1]+(val6*val3)+(val10*val1)+(val11*val2)+(val12*val8)+(val20*val9)+(val21*val13)+(val18*val15)+(val22*val17)+(val23*val19));
    acc0[2] = (acc0[2]+(val5*val3)+(val6*val1)+(val10*val2)+(val4*val8)+(val12*val9)+(val20*val13)+(val16*val15)+(val18*val17)+(val22*val19));
    acc0[3] = (acc0[3]+(val10*val3)+(val11*val1)+(val24*val2)+(val20*val8)+(val21*val9)+(val25*val13)+(val22*val15)+(val23*val17)+(val26*val19));
    acc0[4] = (acc0[4]+(val7*val3)+(val4*val1)+(val12*val2)+(val14*val8)+(val16*val9)+(val18*val13)+(val27*val15)+(val28*val17)+(val29*val19));
    acc0[5] = (acc0[5]+(val12*val3)+(val20*val1)+(val21*val2)+(val18*val8)+(val22*val9)+(val23*val13)+(val29*val15)+(val30*val17)+(val31*val19));
    acc0[6] = (acc0[6]+(val4*val3)+(val12*val1)+(val20*val2)+(val16*val8)+(val18*val9)+(val22*val13)+(val28*val15)+(val29*val17)+(val30*val19));
    acc0[7] = (acc0[7]+(val20*val3)+(val21*val1)+(val25*val2)+(val22*val8)+(val23*val9)+(val26*val13)+(val30*val15)+(val31*val17)+(val32*val19));
    acc0[8] = (acc0[8]+(val14*val3)+(val16*val1)+(val18*val2)+(val27*val8)+(val28*val9)+(val29*val13)+(val33*val15)+(val34*val17)+(val35*val19));
    acc0[9] = (acc0[9]+(val18*val3)+(val22*val1)+(val23*val2)+(val29*val8)+(val30*val9)+(val31*val13)+(val35*val15)+(val36*val17)+(val37*val19));
    acc0[10] = (acc0[10]+(val16*val3)+(val18*val1)+(val22*val2)+(val28*val8)+(val29*val9)+(val30*val13)+(val34*val15)+(val35*val17)+(val36*val19));
    acc0[11] = (acc0[11]+(val22*val3)+(val23*val1)+(val26*val2)+(val30*val8)+(val31*val9)+(val32*val13)+(val36*val15)+(val37*val17)+(val38*val19));
    acc0[12] = (acc0[12]+(val27*val3)+(val28*val1)+(val29*val2)+(val33*val8)+(val34*val9)+(val35*val13)+(val39*val15)+(val40*val17)+(val41*val19));
    acc0[13] = (acc0[13]+(val29*val3)+(val30*val1)+(val31*val2)+(val35*val8)+(val36*val9)+(val37*val13)+(val41*val15)+(val42*val17)+(val43*val19));
    acc0[14] = (acc0[14]+(val28*val3)+(val29*val1)+(val30*val2)+(val34*val8)+(val35*val9)+(val36*val13)+(val40*val15)+(val41*val17)+(val42*val19));
    acc0[15] = (acc0[15]+(val30*val3)+(val31*val1)+(val32*val2)+(val36*val8)+(val37*val9)+(val38*val13)+(val42*val15)+(val43*val17)+(val44*val19));
    acc0[16] = (acc0[16]+(val33*val3)+(val34*val1)+(val35*val2)+(val39*val8)+(val40*val9)+(val41*val13)+(val45*val15)+(val46*val17)+(val47*val19));
    acc0[17] = (acc0[17]+(val35*val3)+(val36*val1)+(val37*val2)+(val41*val8)+(val42*val9)+(val43*val13)+(val47*val15)+(val48*val17)+(val49*val19));
    acc0[18] = (acc0[18]+(val34*val3)+(val35*val1)+(val36*val2)+(val40*val8)+(val41*val9)+(val42*val13)+(val46*val15)+(val47*val17)+(val48*val19));
    acc0[19] = (acc0[19]+(val36*val3)+(val37*val1)+(val38*val2)+(val42*val8)+(val43*val9)+(val44*val13)+(val48*val15)+(val49*val17)+(val50*val19));
    acc0[20] = (acc0[20]+(val39*val3)+(val40*val1)+(val41*val2)+(val45*val8)+(val46*val9)+(val47*val13)+(val51*val15)+(val52*val17)+(val53*val19));
    acc0[21] = (acc0[21]+(val41*val3)+(val42*val1)+(val43*val2)+(val47*val8)+(val48*val9)+(val49*val13)+(val53*val15)+(val54*val17)+(val55*val19));
    acc0[22] = (acc0[22]+(val40*val3)+(val41*val1)+(val42*val2)+(val46*val8)+(val47*val9)+(val48*val13)+(val52*val15)+(val53*val17)+(val54*val19));
    acc0[23] = (acc0[23]+(val42*val3)+(val43*val1)+(val44*val2)+(val48*val8)+(val49*val9)+(val50*val13)+(val54*val15)+(val55*val17)+(val56*val19));
    acc0[24] = (acc0[24]+(val45*val3)+(val46*val1)+(val47*val2)+(val51*val8)+(val52*val9)+(val53*val13)+(val57*val15)+(val58*val17)+(val59*val19));
    acc0[25] = (acc0[25]+(val47*val3)+(val48*val1)+(val49*val2)+(val53*val8)+(val54*val9)+(val55*val13)+(val59*val15)+(val60*val17)+(val61*val19));
    acc0[26] = (acc0[26]+(val46*val3)+(val47*val1)+(val48*val2)+(val52*val8)+(val53*val9)+(val54*val13)+(val58*val15)+(val59*val17)+(val60*val19));
    acc0[27] = (acc0[27]+(val48*val3)+(val49*val1)+(val50*val2)+(val54*val8)+(val55*val9)+(val56*val13)+(val60*val15)+(val61*val17)+(val62*val19));
  }
  var alu64 = (lidx0+bitcast<i32>((bitcast<u32>(gidx2)<<5u)));
  var val63 = data3_64[alu64];
  var val64 = data4_64[alu64];
  var val65 = data5_64[alu64];
  var val66 = data6_64[alu64];
  var val67 = data7_64[alu64];
  var alu65 = (alu0+(gidx2*401408)+(lidx0*12544));
  var alu66 = (1/sqrt((val65+1e-05f)));
  var alu67 = (((acc0[0]-val63)*val64*alu66)+val66);
  var alu68 = (((acc0[1]-val63)*val64*alu66)+val66);
  var alu69 = (((acc0[2]-val63)*val64*alu66)+val66);
  var alu70 = (((acc0[3]-val63)*val64*alu66)+val66);
  var alu71 = select((val67*alu67),alu67,(0.0f<alu67));
  var alu72 = select((val67*alu68),alu68,(0.0f<alu68));
  var alu73 = select((val67*alu69),alu69,(0.0f<alu69));
  var alu74 = select((val67*alu70),alu70,(0.0f<alu70));
  data0_802816[alu65] = alu71;
  data0_802816[(alu65+1)] = alu73;
  data0_802816[(alu65+2)] = alu72;
  data0_802816[(alu65+3)] = alu74;
  var alu79 = (((acc0[4]-val63)*val64*alu66)+val66);
  var alu80 = (((acc0[5]-val63)*val64*alu66)+val66);
  var alu81 = (((acc0[6]-val63)*val64*alu66)+val66);
  var alu82 = (((acc0[7]-val63)*val64*alu66)+val66);
  var alu83 = select((val67*alu79),alu79,(0.0f<alu79));
  var alu84 = select((val67*alu80),alu80,(0.0f<alu80));
  var alu85 = select((val67*alu81),alu81,(0.0f<alu81));
  var alu86 = select((val67*alu82),alu82,(0.0f<alu82));
  data0_802816[(alu65+112)] = alu83;
  data0_802816[(alu65+113)] = alu85;
  data0_802816[(alu65+114)] = alu84;
  data0_802816[(alu65+115)] = alu86;
  var alu91 = (((acc0[8]-val63)*val64*alu66)+val66);
  var alu92 = (((acc0[9]-val63)*val64*alu66)+val66);
  var alu93 = (((acc0[10]-val63)*val64*alu66)+val66);
  var alu94 = (((acc0[11]-val63)*val64*alu66)+val66);
  var alu95 = select((val67*alu91),alu91,(0.0f<alu91));
  var alu96 = select((val67*alu92),alu92,(0.0f<alu92));
  var alu97 = select((val67*alu93),alu93,(0.0f<alu93));
  var alu98 = select((val67*alu94),alu94,(0.0f<alu94));
  data0_802816[(alu65+224)] = alu95;
  data0_802816[(alu65+225)] = alu97;
  data0_802816[(alu65+226)] = alu96;
  data0_802816[(alu65+227)] = alu98;
  var alu103 = (((acc0[12]-val63)*val64*alu66)+val66);
  var alu104 = (((acc0[13]-val63)*val64*alu66)+val66);
  var alu105 = (((acc0[14]-val63)*val64*alu66)+val66);
  var alu106 = (((acc0[15]-val63)*val64*alu66)+val66);
  var alu107 = select((val67*alu103),alu103,(0.0f<alu103));
  var alu108 = select((val67*alu104),alu104,(0.0f<alu104));
  var alu109 = select((val67*alu105),alu105,(0.0f<alu105));
  var alu110 = select((val67*alu106),alu106,(0.0f<alu106));
  data0_802816[(alu65+336)] = alu107;
  data0_802816[(alu65+337)] = alu109;
  data0_802816[(alu65+338)] = alu108;
  data0_802816[(alu65+339)] = alu110;
  var alu115 = (((acc0[16]-val63)*val64*alu66)+val66);
  var alu116 = (((acc0[17]-val63)*val64*alu66)+val66);
  var alu117 = (((acc0[18]-val63)*val64*alu66)+val66);
  var alu118 = (((acc0[19]-val63)*val64*alu66)+val66);
  var alu119 = select((val67*alu115),alu115,(0.0f<alu115));
  var alu120 = select((val67*alu116),alu116,(0.0f<alu116));
  var alu121 = select((val67*alu117),alu117,(0.0f<alu117));
  var alu122 = select((val67*alu118),alu118,(0.0f<alu118));
  data0_802816[(alu65+448)] = alu119;
  data0_802816[(alu65+449)] = alu121;
  data0_802816[(alu65+450)] = alu120;
  data0_802816[(alu65+451)] = alu122;
  var alu127 = (((acc0[20]-val63)*val64*alu66)+val66);
  var alu128 = (((acc0[21]-val63)*val64*alu66)+val66);
  var alu129 = (((acc0[22]-val63)*val64*alu66)+val66);
  var alu130 = (((acc0[23]-val63)*val64*alu66)+val66);
  var alu131 = select((val67*alu127),alu127,(0.0f<alu127));
  var alu132 = select((val67*alu128),alu128,(0.0f<alu128));
  var alu133 = select((val67*alu129),alu129,(0.0f<alu129));
  var alu134 = select((val67*alu130),alu130,(0.0f<alu130));
  data0_802816[(alu65+560)] = alu131;
  data0_802816[(alu65+561)] = alu133;
  data0_802816[(alu65+562)] = alu132;
  data0_802816[(alu65+563)] = alu134;
  var alu139 = (((acc0[24]-val63)*val64*alu66)+val66);
  var alu140 = (((acc0[25]-val63)*val64*alu66)+val66);
  var alu141 = (((acc0[26]-val63)*val64*alu66)+val66);
  var alu142 = (((acc0[27]-val63)*val64*alu66)+val66);
  var alu143 = select((val67*alu139),alu139,(0.0f<alu139));
  var alu144 = select((val67*alu140),alu140,(0.0f<alu140));
  var alu145 = select((val67*alu141),alu141,(0.0f<alu141));
  var alu146 = select((val67*alu142),alu142,(0.0f<alu142));
  data0_802816[(alu65+672)] = alu143;
  data0_802816[(alu65+673)] = alu145;
  data0_802816[(alu65+674)] = alu144;
  data0_802816[(alu65+675)] = alu146;
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

const E_4_196_16_16 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_200704:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_200704:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_64:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_64:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_64:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_64:array<f32>;
@compute @workgroup_size(16,16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 196 */
  var gidx1 = i32(gindex.y); /* 4 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 16 */
  var alu0 = (lidx1+bitcast<i32>((bitcast<u32>(gidx0)<<4u))+(gidx1*50176)+(lidx0*3136));
  var val0 = data1_200704[alu0];
  var alu1 = (lidx0+bitcast<i32>((bitcast<u32>(gidx1)<<4u)));
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

const r_2_14_7_32_2_4_2_2_64_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
@compute @workgroup_size(32,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,16>;
  var gidx0 = i32(gindex.x); /* 7 */
  var gidx1 = i32(gindex.y); /* 14 */
  var gidx2 = i32(gindex.z); /* 2 */
  var lidx0 = i32(lindex.x); /* 32 */
  var lidx1 = i32(lindex.y); /* 2 */
  var alu0 = ((gidx1*224)+(lidx1*112)+bitcast<i32>((bitcast<u32>(gidx0)<<3u)));
  var alu1 = (gidx0<6);
  var alu2 = ((lidx1+bitcast<i32>((bitcast<u32>(gidx1)<<1u)))<27);
  var alu3 = (0<gidx0);
  var alu4 = (0<(gidx1+lidx1));
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
  for (var Ridx0 = 0; Ridx0 < 64; Ridx0++) {
    var alu21 = (alu0+(Ridx0*3136));
    var val0 = select(0.0f, data1_200704[(alu21+-57)], (alu3&alu4));
    var alu22 = ((gidx2*18432)+(lidx0*576)+(Ridx0*9));
    var val1 = data2_36864[alu22];
    var val2 = select(0.0f, data1_200704[(alu21+-56)], alu4);
    var val3 = data2_36864[(alu22+1)];
    var val4 = select(0.0f, data1_200704[(alu21+-55)], alu4);
    var val5 = data2_36864[(alu22+2)];
    var val6 = select(0.0f, data1_200704[(alu21+-1)], alu3);
    var val7 = data2_36864[(alu22+3)];
    var val8 = data1_200704[(alu21+1)];
    var val9 = select(0.0f, data1_200704[(alu21+55)], alu3);
    var val10 = data1_200704[(alu21+56)];
    var val11 = data1_200704[alu21];
    var val12 = data2_36864[(alu22+4)];
    var val13 = data2_36864[(alu22+5)];
    var val14 = data2_36864[(alu22+6)];
    var val15 = data2_36864[(alu22+7)];
    var val16 = data1_200704[(alu21+57)];
    var val17 = data2_36864[(alu22+8)];
    var val18 = select(0.0f, data1_200704[(alu21+-53)], alu4);
    var val19 = select(0.0f, data1_200704[(alu21+-52)], alu4);
    var val20 = select(0.0f, data1_200704[(alu21+-51)], alu4);
    var val21 = data1_200704[(alu21+3)];
    var val22 = data1_200704[(alu21+4)];
    var val23 = data1_200704[(alu21+5)];
    var val24 = data1_200704[(alu21+59)];
    var val25 = data1_200704[(alu21+60)];
    var val26 = data1_200704[(alu21+61)];
    var val27 = select(0.0f, data1_200704[(alu21+113)], alu2);
    var val28 = select(0.0f, data1_200704[(alu21+-54)], alu4);
    var val29 = select(0.0f, data1_200704[(alu21+111)], (alu3&alu2));
    var val30 = select(0.0f, data1_200704[(alu21+112)], alu2);
    var val31 = select(0.0f, data1_200704[(alu21+115)], alu2);
    var val32 = select(0.0f, data1_200704[(alu21+116)], alu2);
    var val33 = select(0.0f, data1_200704[(alu21+117)], alu2);
    var val34 = select(0.0f, data1_200704[(alu21+-50)], alu4);
    var val35 = data1_200704[(alu21+2)];
    var val36 = data1_200704[(alu21+6)];
    var val37 = data1_200704[(alu21+58)];
    var val38 = data1_200704[(alu21+62)];
    var val39 = select(0.0f, data1_200704[(alu21+114)], alu2);
    var val40 = select(0.0f, data1_200704[(alu21+118)], alu2);
    var val41 = select(0.0f, data1_200704[(alu21+-49)], alu4);
    var val42 = data1_200704[(alu21+7)];
    var val43 = data1_200704[(alu21+63)];
    var val44 = select(0.0f, data1_200704[(alu21+119)], alu2);
    var val45 = select(0.0f, data1_200704[(alu21+-48)], (alu1&alu4));
    var val46 = select(0.0f, data1_200704[(alu21+8)], alu1);
    var val47 = select(0.0f, data1_200704[(alu21+64)], alu1);
    var val48 = select(0.0f, data1_200704[(alu21+120)], (alu1&alu2));
    acc0[0] = (acc0[0]+(val0*val1)+(val2*val3)+(val4*val5)+(val6*val7)+(val11*val12)+(val8*val13)+(val9*val14)+(val10*val15)+(val16*val17));
    acc0[1] = (acc0[1]+(val18*val1)+(val19*val3)+(val20*val5)+(val21*val7)+(val22*val12)+(val23*val13)+(val24*val14)+(val25*val15)+(val26*val17));
    acc0[2] = (acc0[2]+(val6*val1)+(val11*val3)+(val8*val5)+(val9*val7)+(val10*val12)+(val16*val13)+(val29*val14)+(val30*val15)+(val27*val17));
    acc0[3] = (acc0[3]+(val21*val1)+(val22*val3)+(val23*val5)+(val24*val7)+(val25*val12)+(val26*val13)+(val31*val14)+(val32*val15)+(val33*val17));
    acc0[4] = (acc0[4]+(val2*val1)+(val4*val3)+(val28*val5)+(val11*val7)+(val8*val12)+(val35*val13)+(val10*val14)+(val16*val15)+(val37*val17));
    acc0[5] = (acc0[5]+(val19*val1)+(val20*val3)+(val34*val5)+(val22*val7)+(val23*val12)+(val36*val13)+(val25*val14)+(val26*val15)+(val38*val17));
    acc0[6] = (acc0[6]+(val11*val1)+(val8*val3)+(val35*val5)+(val10*val7)+(val16*val12)+(val37*val13)+(val30*val14)+(val27*val15)+(val39*val17));
    acc0[7] = (acc0[7]+(val22*val1)+(val23*val3)+(val36*val5)+(val25*val7)+(val26*val12)+(val38*val13)+(val32*val14)+(val33*val15)+(val40*val17));
    acc0[8] = (acc0[8]+(val4*val1)+(val28*val3)+(val18*val5)+(val8*val7)+(val35*val12)+(val21*val13)+(val16*val14)+(val37*val15)+(val24*val17));
    acc0[9] = (acc0[9]+(val20*val1)+(val34*val3)+(val41*val5)+(val23*val7)+(val36*val12)+(val42*val13)+(val26*val14)+(val38*val15)+(val43*val17));
    acc0[10] = (acc0[10]+(val8*val1)+(val35*val3)+(val21*val5)+(val16*val7)+(val37*val12)+(val24*val13)+(val27*val14)+(val39*val15)+(val31*val17));
    acc0[11] = (acc0[11]+(val23*val1)+(val36*val3)+(val42*val5)+(val26*val7)+(val38*val12)+(val43*val13)+(val33*val14)+(val40*val15)+(val44*val17));
    acc0[12] = (acc0[12]+(val28*val1)+(val18*val3)+(val19*val5)+(val35*val7)+(val21*val12)+(val22*val13)+(val37*val14)+(val24*val15)+(val25*val17));
    acc0[13] = (acc0[13]+(val34*val1)+(val41*val3)+(val45*val5)+(val36*val7)+(val42*val12)+(val46*val13)+(val38*val14)+(val43*val15)+(val47*val17));
    acc0[14] = (acc0[14]+(val35*val1)+(val21*val3)+(val22*val5)+(val37*val7)+(val24*val12)+(val25*val13)+(val39*val14)+(val31*val15)+(val32*val17));
    acc0[15] = (acc0[15]+(val36*val1)+(val42*val3)+(val46*val5)+(val38*val7)+(val43*val12)+(val47*val13)+(val40*val14)+(val44*val15)+(val48*val17));
  }
  var alu40 = (lidx0+bitcast<i32>((bitcast<u32>(gidx2)<<5u)));
  var val49 = data3_64[alu40];
  var val50 = data4_64[alu40];
  var val51 = data5_64[alu40];
  var val52 = data6_64[alu40];
  var alu41 = (alu0+(gidx2*100352)+(lidx0*3136));
  var val53 = data7_200704[alu41];
  var alu42 = (alu41+1);
  var val54 = data7_200704[alu42];
  var alu43 = (alu41+2);
  var val55 = data7_200704[alu43];
  var alu44 = (alu41+3);
  var val56 = data7_200704[alu44];
  var alu45 = (alu41+4);
  var val57 = data7_200704[alu45];
  var alu46 = (alu41+5);
  var val58 = data7_200704[alu46];
  var alu47 = (alu41+6);
  var val59 = data7_200704[alu47];
  var alu48 = (alu41+7);
  var val60 = data7_200704[alu48];
  var alu49 = (alu41+56);
  var val61 = data7_200704[alu49];
  var alu50 = (alu41+57);
  var val62 = data7_200704[alu50];
  var alu51 = (alu41+58);
  var val63 = data7_200704[alu51];
  var alu52 = (alu41+59);
  var val64 = data7_200704[alu52];
  var alu53 = (alu41+60);
  var val65 = data7_200704[alu53];
  var alu54 = (alu41+61);
  var val66 = data7_200704[alu54];
  var alu55 = (alu41+62);
  var val67 = data7_200704[alu55];
  var alu56 = (alu41+63);
  var val68 = data7_200704[alu56];
  var alu57 = (1/sqrt((val51+1e-05f)));
  data0_200704[alu49] = (((acc0[2]-val49)*val50*alu57)+val52+val61);
  data0_200704[alu50] = (((acc0[6]-val49)*val50*alu57)+val52+val62);
  data0_200704[alu51] = (((acc0[10]-val49)*val50*alu57)+val52+val63);
  data0_200704[alu52] = (((acc0[14]-val49)*val50*alu57)+val52+val64);
  data0_200704[alu53] = (((acc0[3]-val49)*val50*alu57)+val52+val65);
  data0_200704[alu54] = (((acc0[7]-val49)*val50*alu57)+val52+val66);
  data0_200704[alu55] = (((acc0[11]-val49)*val50*alu57)+val52+val67);
  data0_200704[alu56] = (((acc0[15]-val49)*val50*alu57)+val52+val68);
  data0_200704[alu42] = (((acc0[4]-val49)*val50*alu57)+val52+val54);
  data0_200704[alu43] = (((acc0[8]-val49)*val50*alu57)+val52+val55);
  data0_200704[alu44] = (((acc0[12]-val49)*val50*alu57)+val52+val56);
  data0_200704[alu45] = (((acc0[1]-val49)*val50*alu57)+val52+val57);
  data0_200704[alu46] = (((acc0[5]-val49)*val50*alu57)+val52+val58);
  data0_200704[alu47] = (((acc0[9]-val49)*val50*alu57)+val52+val59);
  data0_200704[alu48] = (((acc0[13]-val49)*val50*alu57)+val52+val60);
  data0_200704[alu41] = (((acc0[0]-val49)*val50*alu57)+val52+val53);
}`;

const r_4_28_16_7_8_64 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  var acc0: array<f32,56>;
  var gidx0 = i32(gindex.x); /* 28 */
  var gidx1 = i32(gindex.y); /* 4 */
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
    var alu56 = (bitcast<i32>((cast0<<1u))+(gidx1*784)+(Ridx0*3136));
    var val0 = data1_200704[alu56];
    var alu57 = (bitcast<i32>((bitcast<u32>(lidx0)<<6u))+Ridx0);
    var val1 = data2_8192[alu57];
    var val2 = data2_8192[(alu57+1024)];
    var val3 = data2_8192[(alu57+2048)];
    var val4 = data2_8192[(alu57+3072)];
    var val5 = data2_8192[(alu57+4096)];
    var val6 = data2_8192[(alu57+5120)];
    var val7 = data2_8192[(alu57+6144)];
    var val8 = data2_8192[(alu57+7168)];
    var val9 = data1_200704[(alu56+112)];
    var val10 = data1_200704[(alu56+224)];
    var val11 = data1_200704[(alu56+336)];
    var val12 = data1_200704[(alu56+448)];
    var val13 = data1_200704[(alu56+560)];
    var val14 = data1_200704[(alu56+672)];
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
  var val15 = data3_128[lidx0];
  var val16 = data4_128[lidx0];
  var val17 = data5_128[lidx0];
  var val18 = data6_128[lidx0];
  var alu115 = (lidx0+16);
  var val19 = data3_128[alu115];
  var alu116 = (lidx0+32);
  var val20 = data3_128[alu116];
  var val21 = data4_128[alu115];
  var val22 = data4_128[alu116];
  var val23 = data5_128[alu115];
  var val24 = data6_128[alu115];
  var val25 = data5_128[alu116];
  var val26 = data6_128[alu116];
  var alu117 = (lidx0+48);
  var val27 = data3_128[alu117];
  var alu118 = (lidx0+64);
  var val28 = data3_128[alu118];
  var val29 = data4_128[alu117];
  var val30 = data4_128[alu118];
  var val31 = data5_128[alu117];
  var val32 = data6_128[alu117];
  var alu119 = (lidx0+80);
  var val33 = data3_128[alu119];
  var val34 = data4_128[alu119];
  var val35 = data5_128[alu119];
  var val36 = data6_128[alu119];
  var alu120 = (lidx0+96);
  var val37 = data3_128[alu120];
  var val38 = data6_128[alu120];
  var alu121 = (lidx0+112);
  var val39 = data3_128[alu121];
  var val40 = data4_128[alu120];
  var val41 = data4_128[alu121];
  var val42 = data5_128[alu118];
  var val43 = data5_128[alu120];
  var val44 = data5_128[alu121];
  var val45 = data6_128[alu118];
  var val46 = data6_128[alu121];
  var alu122 = (lidx0+bitcast<i32>((cast0<<7u))+(gidx1*25088));
  var alu123 = (1/sqrt((val17+1e-05f)));
  var alu124 = (1/sqrt((val23+1e-05f)));
  var alu125 = (1/sqrt((val25+1e-05f)));
  var alu126 = (1/sqrt((val31+1e-05f)));
  var alu127 = (1/sqrt((val42+1e-05f)));
  var alu128 = (1/sqrt((val35+1e-05f)));
  var alu129 = (1/sqrt((val43+1e-05f)));
  var alu130 = (1/sqrt((val44+1e-05f)));
  data0_100352[alu122] = (((acc0[0]-val15)*val16*alu123)+val18);
  data0_100352[(alu122+16)] = (((acc0[1]-val19)*val21*alu124)+val24);
  data0_100352[(alu122+32)] = (((acc0[2]-val20)*val22*alu125)+val26);
  data0_100352[(alu122+48)] = (((acc0[3]-val27)*val29*alu126)+val32);
  data0_100352[(alu122+64)] = (((acc0[4]-val28)*val30*alu127)+val45);
  data0_100352[(alu122+80)] = (((acc0[5]-val33)*val34*alu128)+val36);
  data0_100352[(alu122+96)] = (((acc0[6]-val37)*val40*alu129)+val38);
  data0_100352[(alu122+112)] = (((acc0[7]-val39)*val41*alu130)+val46);
  data0_100352[(alu122+3584)] = (((acc0[8]-val15)*val16*alu123)+val18);
  data0_100352[(alu122+3600)] = (((acc0[9]-val19)*val21*alu124)+val24);
  data0_100352[(alu122+3616)] = (((acc0[10]-val20)*val22*alu125)+val26);
  data0_100352[(alu122+3632)] = (((acc0[11]-val27)*val29*alu126)+val32);
  data0_100352[(alu122+3648)] = (((acc0[12]-val28)*val30*alu127)+val45);
  data0_100352[(alu122+3664)] = (((acc0[13]-val33)*val34*alu128)+val36);
  data0_100352[(alu122+3680)] = (((acc0[14]-val37)*val40*alu129)+val38);
  data0_100352[(alu122+3696)] = (((acc0[15]-val39)*val41*alu130)+val46);
  data0_100352[(alu122+7168)] = (((acc0[16]-val15)*val16*alu123)+val18);
  data0_100352[(alu122+7184)] = (((acc0[17]-val19)*val21*alu124)+val24);
  data0_100352[(alu122+7200)] = (((acc0[18]-val20)*val22*alu125)+val26);
  data0_100352[(alu122+7216)] = (((acc0[19]-val27)*val29*alu126)+val32);
  data0_100352[(alu122+7232)] = (((acc0[20]-val28)*val30*alu127)+val45);
  data0_100352[(alu122+7248)] = (((acc0[21]-val33)*val34*alu128)+val36);
  data0_100352[(alu122+7264)] = (((acc0[22]-val37)*val40*alu129)+val38);
  data0_100352[(alu122+7280)] = (((acc0[23]-val39)*val41*alu130)+val46);
  data0_100352[(alu122+10752)] = (((acc0[24]-val15)*val16*alu123)+val18);
  data0_100352[(alu122+10768)] = (((acc0[25]-val19)*val21*alu124)+val24);
  data0_100352[(alu122+10784)] = (((acc0[26]-val20)*val22*alu125)+val26);
  data0_100352[(alu122+10800)] = (((acc0[27]-val27)*val29*alu126)+val32);
  data0_100352[(alu122+10816)] = (((acc0[28]-val28)*val30*alu127)+val45);
  data0_100352[(alu122+10832)] = (((acc0[29]-val33)*val34*alu128)+val36);
  data0_100352[(alu122+10848)] = (((acc0[30]-val37)*val40*alu129)+val38);
  data0_100352[(alu122+10864)] = (((acc0[31]-val39)*val41*alu130)+val46);
  data0_100352[(alu122+14336)] = (((acc0[32]-val15)*val16*alu123)+val18);
  data0_100352[(alu122+14352)] = (((acc0[33]-val19)*val21*alu124)+val24);
  data0_100352[(alu122+14368)] = (((acc0[34]-val20)*val22*alu125)+val26);
  data0_100352[(alu122+14384)] = (((acc0[35]-val27)*val29*alu126)+val32);
  data0_100352[(alu122+14400)] = (((acc0[36]-val28)*val30*alu127)+val45);
  data0_100352[(alu122+14416)] = (((acc0[37]-val33)*val34*alu128)+val36);
  data0_100352[(alu122+14432)] = (((acc0[38]-val37)*val40*alu129)+val38);
  data0_100352[(alu122+14448)] = (((acc0[39]-val39)*val41*alu130)+val46);
  data0_100352[(alu122+17920)] = (((acc0[40]-val15)*val16*alu123)+val18);
  data0_100352[(alu122+17936)] = (((acc0[41]-val19)*val21*alu124)+val24);
  data0_100352[(alu122+17952)] = (((acc0[42]-val20)*val22*alu125)+val26);
  data0_100352[(alu122+17968)] = (((acc0[43]-val27)*val29*alu126)+val32);
  data0_100352[(alu122+17984)] = (((acc0[44]-val28)*val30*alu127)+val45);
  data0_100352[(alu122+18000)] = (((acc0[45]-val33)*val34*alu128)+val36);
  data0_100352[(alu122+18016)] = (((acc0[46]-val37)*val40*alu129)+val38);
  data0_100352[(alu122+18032)] = (((acc0[47]-val39)*val41*alu130)+val46);
  data0_100352[(alu122+21504)] = (((acc0[48]-val15)*val16*alu123)+val18);
  data0_100352[(alu122+21520)] = (((acc0[49]-val19)*val21*alu124)+val24);
  data0_100352[(alu122+21536)] = (((acc0[50]-val20)*val22*alu125)+val26);
  data0_100352[(alu122+21552)] = (((acc0[51]-val27)*val29*alu126)+val32);
  data0_100352[(alu122+21568)] = (((acc0[52]-val28)*val30*alu127)+val45);
  data0_100352[(alu122+21584)] = (((acc0[53]-val33)*val34*alu128)+val36);
  data0_100352[(alu122+21600)] = (((acc0[54]-val37)*val40*alu129)+val38);
  data0_100352[(alu122+21616)] = (((acc0[55]-val39)*val41*alu130)+val46);
}`;

const r_4_8_56_32_7_64_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  var acc0: array<f32,7>;
  var gidx0 = i32(gindex.x); /* 56 */
  var gidx1 = i32(gindex.y); /* 8 */
  var gidx2 = i32(gindex.z); /* 4 */
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
        var val1 = data2_73728[((Ridx1*3)+Ridx2+(Ridx0*9)+(gidx2*18432)+(lidx0*576))];
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
  var val8 = data3_128[alu21];
  var val9 = data4_128[alu21];
  var val10 = data5_128[alu21];
  var val11 = data6_128[alu21];
  var val12 = data7_128[alu21];
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
  data0_401408[alu22] = alu31;
  data0_401408[(alu22+56)] = alu32;
  data0_401408[(alu22+112)] = alu33;
  data0_401408[(alu22+168)] = alu34;
  data0_401408[(alu22+224)] = alu35;
  data0_401408[(alu22+280)] = alu36;
  data0_401408[(alu22+336)] = alu37;
}`;

const r_14_4_16_4_7_2_2_128_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  var acc0: array<f32,28>;
  var gidx0 = i32(gindex.x); /* 4 */
  var gidx1 = i32(gindex.y); /* 14 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (gidx0*14);
  var alu1 = (0<gidx0);
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
  for (var Ridx0 = 0; Ridx0 < 128; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu30 = (bitcast<i32>((bitcast<u32>(gidx1)<<2u))+Ridx1+(Ridx0*56)+-1);
      var alu31 = ((gidx1*224)+(Ridx1*56)+alu0+(Ridx0*3136));
      var alu32 = (alu31+-57);
      var alu33 = select(0,63,(alu32<0));
      var alu34 = select(0,1,(alu30<0));
      var alu35 = (0<(gidx1+Ridx1));
      var val0 = select(0.0f, data1_401408[(alu0+((alu30-(56*(((alu30*9363)>>19u)+alu34)))*56)+(((((alu32+alu33)>>6u)*2675)>>17u)*3136)+-1)], (alu1&alu35));
      var alu36 = ((lidx0*1152)+(lidx1*36864)+(Ridx0*9)+(Ridx1*3));
      var val1 = data2_147456[(alu36+1)];
      var val2 = data2_147456[(alu36+18434)];
      var val3 = data2_147456[alu36];
      var val4 = select(0.0f, data1_401408[(alu31+-56)], alu35);
      var val5 = select(0.0f, data1_401408[(alu31+-55)], alu35);
      var val6 = data2_147456[(alu36+2)];
      var val7 = data2_147456[(alu36+18432)];
      var val8 = data2_147456[(alu36+18433)];
      var val9 = select(0.0f, data1_401408[(alu31+-46)], alu35);
      var val10 = select(0.0f, data1_401408[(alu31+-45)], alu35);
      var val11 = select(0.0f, data1_401408[(alu31+55)], alu1);
      var val12 = data1_401408[(alu31+56)];
      var val13 = data1_401408[(alu31+57)];
      var val14 = select(0.0f, data1_401408[(alu31+-54)], alu35);
      var val15 = select(0.0f, data1_401408[(alu31+-53)], alu35);
      var val16 = select(0.0f, data1_401408[(alu31+-52)], alu35);
      var val17 = data1_401408[(alu31+58)];
      var val18 = data1_401408[(alu31+59)];
      var val19 = select(0.0f, data1_401408[(alu31+-51)], alu35);
      var val20 = select(0.0f, data1_401408[(alu31+-50)], alu35);
      var val21 = data1_401408[(alu31+60)];
      var val22 = data1_401408[(alu31+61)];
      var val23 = select(0.0f, data1_401408[(alu31+-49)], alu35);
      var val24 = select(0.0f, data1_401408[(alu31+-48)], alu35);
      var val25 = select(0.0f, data1_401408[(alu31+-47)], alu35);
      var val26 = data1_401408[(alu31+62)];
      var val27 = data1_401408[(alu31+63)];
      var val28 = data1_401408[(alu31+64)];
      var val29 = data1_401408[(alu31+65)];
      var val30 = select(0.0f, data1_401408[(alu31+-43)], alu35);
      var val31 = data1_401408[(alu31+66)];
      var val32 = data1_401408[(alu31+67)];
      var val33 = select(0.0f, data1_401408[(alu31+-44)], alu35);
      var val34 = data1_401408[(alu31+68)];
      var val35 = data1_401408[(alu31+69)];
      acc0[0] = (acc0[0]+(val0*val3)+(val4*val1)+(val5*val6));
      acc0[1] = (acc0[1]+(val0*val7)+(val4*val8)+(val5*val2));
      acc0[2] = (acc0[2]+(val11*val3)+(val12*val1)+(val13*val6));
      acc0[3] = (acc0[3]+(val11*val7)+(val12*val8)+(val13*val2));
      acc0[4] = (acc0[4]+(val5*val3)+(val14*val1)+(val15*val6));
      acc0[5] = (acc0[5]+(val5*val7)+(val14*val8)+(val15*val2));
      acc0[6] = (acc0[6]+(val13*val3)+(val17*val1)+(val18*val6));
      acc0[7] = (acc0[7]+(val13*val7)+(val17*val8)+(val18*val2));
      acc0[8] = (acc0[8]+(val15*val3)+(val16*val1)+(val19*val6));
      acc0[9] = (acc0[9]+(val15*val7)+(val16*val8)+(val19*val2));
      acc0[10] = (acc0[10]+(val18*val3)+(val21*val1)+(val22*val6));
      acc0[11] = (acc0[11]+(val18*val7)+(val21*val8)+(val22*val2));
      acc0[12] = (acc0[12]+(val19*val3)+(val20*val1)+(val23*val6));
      acc0[13] = (acc0[13]+(val19*val7)+(val20*val8)+(val23*val2));
      acc0[14] = (acc0[14]+(val22*val3)+(val26*val1)+(val27*val6));
      acc0[15] = (acc0[15]+(val22*val7)+(val26*val8)+(val27*val2));
      acc0[16] = (acc0[16]+(val23*val3)+(val24*val1)+(val25*val6));
      acc0[17] = (acc0[17]+(val23*val7)+(val24*val8)+(val25*val2));
      acc0[18] = (acc0[18]+(val27*val3)+(val28*val1)+(val29*val6));
      acc0[19] = (acc0[19]+(val27*val7)+(val28*val8)+(val29*val2));
      acc0[20] = (acc0[20]+(val25*val3)+(val9*val1)+(val10*val6));
      acc0[21] = (acc0[21]+(val25*val7)+(val9*val8)+(val10*val2));
      acc0[22] = (acc0[22]+(val29*val3)+(val31*val1)+(val32*val6));
      acc0[23] = (acc0[23]+(val29*val7)+(val31*val8)+(val32*val2));
      acc0[24] = (acc0[24]+(val10*val3)+(val33*val1)+(val30*val6));
      acc0[25] = (acc0[25]+(val10*val7)+(val33*val8)+(val30*val2));
      acc0[26] = (acc0[26]+(val32*val3)+(val34*val1)+(val35*val6));
      acc0[27] = (acc0[27]+(val32*val7)+(val34*val8)+(val35*val2));
    }
  }
  var alu67 = (lidx0+bitcast<i32>((bitcast<u32>(lidx1)<<5u)));
  var val36 = data3_128[alu67];
  var alu68 = (alu67+16);
  var val37 = data3_128[alu68];
  var val38 = data4_128[alu67];
  var val39 = data5_128[alu67];
  var val40 = data5_128[alu68];
  var val41 = data6_128[alu67];
  var val42 = data4_128[alu68];
  var val43 = data6_128[alu68];
  var alu69 = (alu67+(gidx0*896)+(gidx1*7168));
  var alu70 = (1/sqrt((val39+1e-05f)));
  var alu71 = (1/sqrt((val40+1e-05f)));
  data0_100352[alu69] = (((acc0[0]-val36)*val38*alu70)+val41);
  data0_100352[(alu69+16)] = (((acc0[1]-val37)*val42*alu71)+val43);
  data0_100352[(alu69+128)] = (((acc0[4]-val36)*val38*alu70)+val41);
  data0_100352[(alu69+144)] = (((acc0[5]-val37)*val42*alu71)+val43);
  data0_100352[(alu69+256)] = (((acc0[8]-val36)*val38*alu70)+val41);
  data0_100352[(alu69+272)] = (((acc0[9]-val37)*val42*alu71)+val43);
  data0_100352[(alu69+384)] = (((acc0[12]-val36)*val38*alu70)+val41);
  data0_100352[(alu69+400)] = (((acc0[13]-val37)*val42*alu71)+val43);
  data0_100352[(alu69+512)] = (((acc0[16]-val36)*val38*alu70)+val41);
  data0_100352[(alu69+528)] = (((acc0[17]-val37)*val42*alu71)+val43);
  data0_100352[(alu69+640)] = (((acc0[20]-val36)*val38*alu70)+val41);
  data0_100352[(alu69+656)] = (((acc0[21]-val37)*val42*alu71)+val43);
  data0_100352[(alu69+768)] = (((acc0[24]-val36)*val38*alu70)+val41);
  data0_100352[(alu69+784)] = (((acc0[25]-val37)*val42*alu71)+val43);
  data0_100352[(alu69+3584)] = (((acc0[2]-val36)*val38*alu70)+val41);
  data0_100352[(alu69+3600)] = (((acc0[3]-val37)*val42*alu71)+val43);
  data0_100352[(alu69+3712)] = (((acc0[6]-val36)*val38*alu70)+val41);
  data0_100352[(alu69+3728)] = (((acc0[7]-val37)*val42*alu71)+val43);
  data0_100352[(alu69+3840)] = (((acc0[10]-val36)*val38*alu70)+val41);
  data0_100352[(alu69+3856)] = (((acc0[11]-val37)*val42*alu71)+val43);
  data0_100352[(alu69+3968)] = (((acc0[14]-val36)*val38*alu70)+val41);
  data0_100352[(alu69+3984)] = (((acc0[15]-val37)*val42*alu71)+val43);
  data0_100352[(alu69+4096)] = (((acc0[18]-val36)*val38*alu70)+val41);
  data0_100352[(alu69+4112)] = (((acc0[19]-val37)*val42*alu71)+val43);
  data0_100352[(alu69+4224)] = (((acc0[22]-val36)*val38*alu70)+val41);
  data0_100352[(alu69+4240)] = (((acc0[23]-val37)*val42*alu71)+val43);
  data0_100352[(alu69+4352)] = (((acc0[26]-val36)*val38*alu70)+val41);
  data0_100352[(alu69+4368)] = (((acc0[27]-val37)*val42*alu71)+val43);
}`;

const E_64_112_2_7 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_100352:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_100352:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_100352:array<f32>;
@compute @workgroup_size(2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 112 */
  var gidx1 = i32(gindex.y); /* 64 */
  var lidx0 = i32(lindex.x); /* 2 */
  var alu0 = (lidx0+bitcast<i32>((bitcast<u32>(gidx1)<<1u))+(gidx0*896));
  var val0 = data1_100352[alu0];
  var alu1 = (alu0+128);
  var val1 = data1_100352[alu1];
  var alu2 = (alu0+256);
  var val2 = data1_100352[alu2];
  var alu3 = (alu0+384);
  var val3 = data1_100352[alu3];
  var alu4 = (alu0+512);
  var val4 = data1_100352[alu4];
  var alu5 = (alu0+640);
  var val5 = data1_100352[alu5];
  var alu6 = (alu0+768);
  var val6 = data1_100352[alu6];
  var val7 = data2_100352[alu0];
  var val8 = data2_100352[alu1];
  var val9 = data2_100352[alu2];
  var val10 = data2_100352[alu3];
  var val11 = data2_100352[alu4];
  var val12 = data2_100352[alu5];
  var val13 = data2_100352[alu6];
  var alu7 = ((gidx1*1568)+(lidx0*784)+(gidx0*7));
  data0_100352[(alu7+1)] = (val1+val8);
  data0_100352[(alu7+2)] = (val2+val9);
  data0_100352[(alu7+3)] = (val3+val10);
  data0_100352[(alu7+4)] = (val4+val11);
  data0_100352[(alu7+5)] = (val5+val12);
  data0_100352[(alu7+6)] = (val6+val13);
  data0_100352[alu7] = (val0+val7);
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

const r_28_4_32_7_4_128_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  var acc0: array<f32,28>;
  var gidx0 = i32(gindex.x); /* 4 */
  var gidx1 = i32(gindex.y); /* 28 */
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
  for (var Ridx0 = 0; Ridx0 < 128; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu30 = (gidx1+Ridx1);
      var alu31 = ((0<alu30)&(alu30<29));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu32 = (alu0+Ridx2);
        var alu33 = (alu32+alu1+(Ridx1*28)+(Ridx0*784));
        var val0 = select(0.0f, data1_100352[(alu33+-29)], ((0<(gidx0+Ridx2))&alu31));
        var alu34 = ((Ridx1*3)+Ridx2+(Ridx0*9)+(lidx0*1152));
        var val1 = data2_147456[alu34];
        var val2 = data2_147456[(alu34+36864)];
        var val3 = data2_147456[(alu34+73728)];
        var val4 = data2_147456[(alu34+110592)];
        var val5 = select(0.0f, data1_100352[(alu33+-28)], alu31);
        var val6 = select(0.0f, data1_100352[(alu33+-27)], alu31);
        var val7 = select(0.0f, data1_100352[(alu33+-26)], alu31);
        var val8 = select(0.0f, data1_100352[(alu33+-25)], alu31);
        var val9 = select(0.0f, data1_100352[(alu33+-24)], alu31);
        var val10 = select(0.0f, data1_100352[(alu33+-23)], ((alu32<23)&alu31));
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
  var val11 = data3_128[lidx0];
  var val12 = data4_128[lidx0];
  var val13 = data5_128[lidx0];
  var val14 = data6_128[lidx0];
  var val15 = data7_128[lidx0];
  var alu66 = (lidx0+32);
  var val16 = data3_128[alu66];
  var val17 = data4_128[alu66];
  var val18 = data5_128[alu66];
  var val19 = data6_128[alu66];
  var val20 = data7_128[alu66];
  var alu67 = (lidx0+64);
  var val21 = data3_128[alu67];
  var val22 = data4_128[alu67];
  var val23 = data5_128[alu67];
  var val24 = data6_128[alu67];
  var val25 = data7_128[alu67];
  var alu68 = (lidx0+96);
  var val26 = data3_128[alu68];
  var val27 = data4_128[alu68];
  var val28 = data5_128[alu68];
  var val29 = data6_128[alu68];
  var val30 = data7_128[alu68];
  var alu69 = (alu0+alu1+(lidx0*784));
  var alu70 = (1/sqrt((val18+1e-05f)));
  var alu71 = (((acc0[1]-val16)*val17*alu70)+val19);
  var alu72 = (((acc0[5]-val16)*val17*alu70)+val19);
  var alu73 = (((acc0[9]-val16)*val17*alu70)+val19);
  var alu74 = (((acc0[13]-val16)*val17*alu70)+val19);
  var alu75 = (((acc0[17]-val16)*val17*alu70)+val19);
  var alu76 = (((acc0[21]-val16)*val17*alu70)+val19);
  var alu77 = (((acc0[25]-val16)*val17*alu70)+val19);
  var alu78 = select((val20*alu71),alu71,(0.0f<alu71));
  var alu79 = select((val20*alu72),alu72,(0.0f<alu72));
  var alu80 = select((val20*alu73),alu73,(0.0f<alu73));
  var alu81 = select((val20*alu74),alu74,(0.0f<alu74));
  var alu82 = select((val20*alu75),alu75,(0.0f<alu75));
  var alu83 = select((val20*alu76),alu76,(0.0f<alu76));
  var alu84 = select((val20*alu77),alu77,(0.0f<alu77));
  data0_100352[(alu69+25088)] = alu78;
  data0_100352[(alu69+25089)] = alu79;
  data0_100352[(alu69+25090)] = alu80;
  data0_100352[(alu69+25091)] = alu81;
  data0_100352[(alu69+25092)] = alu82;
  data0_100352[(alu69+25093)] = alu83;
  data0_100352[(alu69+25094)] = alu84;
  var alu92 = (1/sqrt((val23+1e-05f)));
  var alu93 = (((acc0[2]-val21)*val22*alu92)+val24);
  var alu94 = (((acc0[6]-val21)*val22*alu92)+val24);
  var alu95 = (((acc0[10]-val21)*val22*alu92)+val24);
  var alu96 = (((acc0[14]-val21)*val22*alu92)+val24);
  var alu97 = (((acc0[18]-val21)*val22*alu92)+val24);
  var alu98 = (((acc0[22]-val21)*val22*alu92)+val24);
  var alu99 = (((acc0[26]-val21)*val22*alu92)+val24);
  var alu100 = select((val25*alu93),alu93,(0.0f<alu93));
  var alu101 = select((val25*alu94),alu94,(0.0f<alu94));
  var alu102 = select((val25*alu95),alu95,(0.0f<alu95));
  var alu103 = select((val25*alu96),alu96,(0.0f<alu96));
  var alu104 = select((val25*alu97),alu97,(0.0f<alu97));
  var alu105 = select((val25*alu98),alu98,(0.0f<alu98));
  var alu106 = select((val25*alu99),alu99,(0.0f<alu99));
  data0_100352[(alu69+50176)] = alu100;
  data0_100352[(alu69+50177)] = alu101;
  data0_100352[(alu69+50178)] = alu102;
  data0_100352[(alu69+50179)] = alu103;
  data0_100352[(alu69+50180)] = alu104;
  data0_100352[(alu69+50181)] = alu105;
  data0_100352[(alu69+50182)] = alu106;
  var alu114 = (1/sqrt((val28+1e-05f)));
  var alu115 = (((acc0[3]-val26)*val27*alu114)+val29);
  var alu116 = (((acc0[7]-val26)*val27*alu114)+val29);
  var alu117 = (((acc0[11]-val26)*val27*alu114)+val29);
  var alu118 = (((acc0[15]-val26)*val27*alu114)+val29);
  var alu119 = (((acc0[19]-val26)*val27*alu114)+val29);
  var alu120 = (((acc0[23]-val26)*val27*alu114)+val29);
  var alu121 = (((acc0[27]-val26)*val27*alu114)+val29);
  var alu122 = select((val30*alu115),alu115,(0.0f<alu115));
  var alu123 = select((val30*alu116),alu116,(0.0f<alu116));
  var alu124 = select((val30*alu117),alu117,(0.0f<alu117));
  var alu125 = select((val30*alu118),alu118,(0.0f<alu118));
  var alu126 = select((val30*alu119),alu119,(0.0f<alu119));
  var alu127 = select((val30*alu120),alu120,(0.0f<alu120));
  var alu128 = select((val30*alu121),alu121,(0.0f<alu121));
  data0_100352[(alu69+75264)] = alu122;
  data0_100352[(alu69+75265)] = alu123;
  data0_100352[(alu69+75266)] = alu124;
  data0_100352[(alu69+75267)] = alu125;
  data0_100352[(alu69+75268)] = alu126;
  data0_100352[(alu69+75269)] = alu127;
  data0_100352[(alu69+75270)] = alu128;
  var alu136 = (1/sqrt((val13+1e-05f)));
  var alu137 = (((acc0[0]-val11)*val12*alu136)+val14);
  var alu138 = (((acc0[4]-val11)*val12*alu136)+val14);
  var alu139 = (((acc0[8]-val11)*val12*alu136)+val14);
  var alu140 = (((acc0[12]-val11)*val12*alu136)+val14);
  var alu141 = (((acc0[16]-val11)*val12*alu136)+val14);
  var alu142 = (((acc0[20]-val11)*val12*alu136)+val14);
  var alu143 = (((acc0[24]-val11)*val12*alu136)+val14);
  var alu144 = select((val15*alu137),alu137,(0.0f<alu137));
  var alu145 = select((val15*alu138),alu138,(0.0f<alu138));
  var alu146 = select((val15*alu139),alu139,(0.0f<alu139));
  var alu147 = select((val15*alu140),alu140,(0.0f<alu140));
  var alu148 = select((val15*alu141),alu141,(0.0f<alu141));
  var alu149 = select((val15*alu142),alu142,(0.0f<alu142));
  var alu150 = select((val15*alu143),alu143,(0.0f<alu143));
  data0_100352[(alu69+1)] = alu145;
  data0_100352[(alu69+2)] = alu146;
  data0_100352[(alu69+3)] = alu147;
  data0_100352[(alu69+4)] = alu148;
  data0_100352[(alu69+5)] = alu149;
  data0_100352[(alu69+6)] = alu150;
  data0_100352[alu69] = alu144;
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

const r_14_14_32_4_8_2_16 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
var<workgroup> temp0: array<f32,64>;
@group(0) @binding(1)var<storage,read_write>data0_50176:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_100352:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_32768:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_256:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_256:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_256:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_256:array<f32>;
@compute @workgroup_size(4,8) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,2>;
  var acc1: array<f32,2>;
  var gidx0 = i32(gindex.x); /* 32 */
  var gidx1 = i32(gindex.y); /* 14 */
  var gidx2 = i32(gindex.z); /* 14 */
  var lidx0 = i32(lindex.x); /* 4 */
  var lidx1 = i32(lindex.y); /* 8 */
  var cast0 = bitcast<u32>(gidx0);
  var cast1 = bitcast<u32>(gidx1);
  var cast2 = bitcast<u32>(lidx0);
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 16; Ridx0++) {
    var val0 = data1_100352[(bitcast<i32>((cast1<<1u))+(gidx2*56)+(lidx1*784)+(Ridx0*6272))];
    var alu2 = (lidx1+bitcast<i32>((bitcast<u32>(Ridx0)<<3u))+bitcast<i32>((cast0<<10u))+bitcast<i32>((cast2<<7u)));
    var val1 = data2_32768[alu2];
    var val2 = data2_32768[(alu2+512)];
    acc0[0] = (acc0[0]+(val0*val1));
    acc0[1] = (acc0[1]+(val0*val2));
  }
  var cast3 = bitcast<i32>((cast2<<4u));
  var alu6 = (cast3+bitcast<i32>((bitcast<u32>(lidx1)<<1u)));
  temp0[alu6] = acc0[0];
  temp0[(alu6+1)] = acc0[1];
  workgroupBarrier();
  acc1[0] = 0.0f;
  acc1[1] = 0.0f;
  for (var Ridx105 = 0; Ridx105 < 8; Ridx105++) {
    var alu12 = (cast3+bitcast<i32>((bitcast<u32>(Ridx105)<<1u)));
    var val3 = temp0[alu12];
    var val4 = temp0[(alu12+1)];
    acc1[0] = (acc1[0]+val3);
    acc1[1] = (acc1[1]+val4);
  }
  var alu16 = (lidx0+bitcast<i32>((cast0<<3u)));
  var val5 = data3_256[alu16];
  var alu17 = (alu16+4);
  var val6 = data3_256[alu17];
  var val7 = data4_256[alu16];
  var val8 = data4_256[alu17];
  var val9 = data5_256[alu16];
  var val10 = data5_256[alu17];
  var val11 = data6_256[alu16];
  var val12 = data6_256[alu17];
  var alu18 = (alu16+bitcast<i32>((cast1<<8u))+(gidx2*3584));
  var alu19 = ((bool(lidx1))!=true);
  if (alu19) {
    data0_50176[alu18] = (((acc1[0]-val5)*val7*(1/sqrt((val9+1e-05f))))+val11);
  }
  if (alu19) {
    data0_50176[(alu18+4)] = (((acc1[1]-val6)*val8*(1/sqrt((val10+1e-05f))))+val12);
  }
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

const E_16_196_16 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0_50176:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_50176:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_256:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_256:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_256:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_256:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 196 */
  var gidx1 = i32(gindex.y); /* 16 */
  var lidx0 = i32(lindex.x); /* 16 */
  var alu0 = (gidx0+(gidx1*3136)+(lidx0*196));
  var val0 = data1_50176[alu0];
  var alu1 = (lidx0+bitcast<i32>((bitcast<u32>(gidx1)<<4u)));
  var val1 = data2_256[alu1];
  var val2 = data3_256[alu1];
  var val3 = data4_256[alu1];
  var val4 = data5_256[alu1];
  data0_50176[alu0] = (((val0-val1)*val2*(1/sqrt((val3+1e-05f))))+val4);
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
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 256; Ridx0++) {
    var alu7 = ((gidx1*28)+(Ridx0*196));
    var val0 = data1_50176[(alu7+10)];
    var val1 = data1_50176[alu7];
    var val2 = data2_131072[(bitcast<i32>((cast0<<12u))+bitcast<i32>((bitcast<u32>(lidx0)<<8u))+Ridx0)];
    var val3 = data1_50176[(alu7+2)];
    var val4 = data1_50176[(alu7+4)];
    var val5 = data1_50176[(alu7+6)];
    var val6 = data1_50176[(alu7+8)];
    var val7 = data1_50176[(alu7+12)];
    acc0[0] = (acc0[0]+(val1*val2));
    acc0[1] = (acc0[1]+(val3*val2));
    acc0[2] = (acc0[2]+(val4*val2));
    acc0[3] = (acc0[3]+(val5*val2));
    acc0[4] = (acc0[4]+(val6*val2));
    acc0[5] = (acc0[5]+(val0*val2));
    acc0[6] = (acc0[6]+(val7*val2));
  }
  var alu16 = (lidx0+bitcast<i32>((cast0<<4u)));
  var val8 = data3_512[alu16];
  var val9 = data4_512[alu16];
  var val10 = data5_512[alu16];
  var val11 = data6_512[alu16];
  var alu17 = (alu16+(gidx1*3584));
  var alu18 = (1/sqrt((val10+1e-05f)));
  data0_25088[alu17] = (((acc0[0]-val8)*val9*alu18)+val11);
  data0_25088[(alu17+512)] = (((acc0[1]-val8)*val9*alu18)+val11);
  data0_25088[(alu17+1024)] = (((acc0[2]-val8)*val9*alu18)+val11);
  data0_25088[(alu17+1536)] = (((acc0[3]-val8)*val9*alu18)+val11);
  data0_25088[(alu17+2048)] = (((acc0[4]-val8)*val9*alu18)+val11);
  data0_25088[(alu17+2560)] = (((acc0[5]-val8)*val9*alu18)+val11);
  data0_25088[(alu17+3072)] = (((acc0[6]-val8)*val9*alu18)+val11);
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

const r_7_32_16_16_7_32_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
var<workgroup> temp0: array<f32,1792>;
@group(0) @binding(1)var<storage,read_write>data0_25088:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1_100352:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2_2359296:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3_512:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4_512:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5_512:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6_512:array<f32>;
@compute @workgroup_size(16,16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var acc0: array<f32,7>;
  var acc1: array<f32,7>;
  var gidx0 = i32(gindex.x); /* 32 */
  var gidx1 = i32(gindex.y); /* 7 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 16 */
  acc0[0] = 0.0f;
  acc0[1] = 0.0f;
  acc0[2] = 0.0f;
  acc0[3] = 0.0f;
  acc0[4] = 0.0f;
  acc0[5] = 0.0f;
  acc0[6] = 0.0f;
  for (var Ridx0 = 0; Ridx0 < 32; Ridx0++) {
    for (var Ridx1 = 0; Ridx1 < 3; Ridx1++) {
      var alu7 = (bitcast<i32>((bitcast<u32>(gidx1)<<1u))+Ridx1+(lidx1*448)+(Ridx0*14)+-1);
      var alu8 = select(0,1,(alu7<0));
      var alu9 = (0<(gidx1+Ridx1));
      for (var Ridx2 = 0; Ridx2 < 3; Ridx2++) {
        var alu10 = ((gidx1*28)+(Ridx1*14)+Ridx2+(lidx1*6272)+(Ridx0*196));
        var alu11 = (alu10+-15);
        var alu12 = select(0,3,(alu11<0));
        var alu13 = ((alu11+alu12)>>2u);
        var alu14 = select(0,1,(alu13<0));
        var val0 = select(0.0f, data1_100352[(((alu7-(14*(((alu7*9363)>>17u)+alu8)))*14)+Ridx2+((((alu13*2675)>>17u)+alu14)*196)+-1)], ((0<Ridx2)&alu9));
        var val1 = data2_2359296[((lidx1*288)+(Ridx0*9)+(Ridx1*3)+Ridx2+(gidx0*73728)+(lidx0*4608))];
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
  var alu25 = (lidx0*112);
  var alu26 = (alu25+(lidx1*7));
  temp0[(alu26+1)] = acc0[1];
  temp0[(alu26+2)] = acc0[2];
  temp0[(alu26+3)] = acc0[3];
  temp0[(alu26+4)] = acc0[4];
  temp0[(alu26+5)] = acc0[5];
  temp0[(alu26+6)] = acc0[6];
  temp0[alu26] = acc0[0];
  workgroupBarrier();
  acc1[0] = 0.0f;
  acc1[1] = 0.0f;
  acc1[2] = 0.0f;
  acc1[3] = 0.0f;
  acc1[4] = 0.0f;
  acc1[5] = 0.0f;
  acc1[6] = 0.0f;
  for (var Ridx108 = 0; Ridx108 < 16; Ridx108++) {
    var alu42 = (alu25+(Ridx108*7));
    var val8 = temp0[(alu42+3)];
    var val9 = temp0[alu42];
    var val10 = temp0[(alu42+1)];
    var val11 = temp0[(alu42+2)];
    var val12 = temp0[(alu42+4)];
    var val13 = temp0[(alu42+5)];
    var val14 = temp0[(alu42+6)];
    acc1[0] = (acc1[0]+val9);
    acc1[1] = (acc1[1]+val10);
    acc1[2] = (acc1[2]+val11);
    acc1[3] = (acc1[3]+val8);
    acc1[4] = (acc1[4]+val12);
    acc1[5] = (acc1[5]+val13);
    acc1[6] = (acc1[6]+val14);
  }
  var alu51 = (lidx0+bitcast<i32>((bitcast<u32>(gidx0)<<4u)));
  var val15 = data3_512[alu51];
  var val16 = data4_512[alu51];
  var val17 = data5_512[alu51];
  var val18 = data6_512[alu51];
  var alu52 = (alu51+(gidx1*3584));
  var alu53 = ((bool(lidx1))!=true);
  var alu54 = (1/sqrt((val17+1e-05f)));
  if (alu53) {
    data0_25088[alu52] = (((acc1[0]-val15)*val16*alu54)+val18);
  }
  if (alu53) {
    data0_25088[(alu52+512)] = (((acc1[1]-val15)*val16*alu54)+val18);
  }
  if (alu53) {
    data0_25088[(alu52+1024)] = (((acc1[2]-val15)*val16*alu54)+val18);
  }
  if (alu53) {
    data0_25088[(alu52+1536)] = (((acc1[3]-val15)*val16*alu54)+val18);
  }
  if (alu53) {
    data0_25088[(alu52+2048)] = (((acc1[4]-val15)*val16*alu54)+val18);
  }
  if (alu53) {
    data0_25088[(alu52+2560)] = (((acc1[5]-val15)*val16*alu54)+val18);
  }
  if (alu53) {
    data0_25088[(alu52+3072)] = (((acc1[6]-val15)*val16*alu54)+val18);
  }
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

const E_128_49_4n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  var alu0 = (gidx0+(gidx1*196));
  var val0 = data1_25088[alu0];
  var cast0 = bitcast<i32>((bitcast<u32>(gidx1)<<2u));
  var val1 = data2_512[cast0];
  var alu1 = (cast0+3);
  var val2 = data2_512[alu1];
  var val3 = data3_512[cast0];
  var val4 = data4_512[cast0];
  var val5 = data5_512[cast0];
  var alu2 = (alu0+49);
  var val6 = data1_25088[alu2];
  var alu3 = (cast0+1);
  var val7 = data2_512[alu3];
  var val8 = data3_512[alu3];
  var val9 = data4_512[alu3];
  var val10 = data5_512[alu3];
  var alu4 = (alu0+98);
  var val11 = data1_25088[alu4];
  var alu5 = (cast0+2);
  var val12 = data2_512[alu5];
  var val13 = data3_512[alu5];
  var val14 = data3_512[alu1];
  var val15 = data4_512[alu5];
  var val16 = data5_512[alu5];
  var alu6 = (alu0+147);
  var val17 = data1_25088[alu6];
  var val18 = data4_512[alu1];
  var val19 = data5_512[alu1];
  data0_25088[alu0] = (((val0-val1)*val3*(1/sqrt((val4+1e-05f))))+val5);
  data0_25088[alu2] = (((val6-val7)*val8*(1/sqrt((val9+1e-05f))))+val10);
  data0_25088[alu4] = (((val11-val12)*val13*(1/sqrt((val15+1e-05f))))+val16);
  data0_25088[alu6] = (((val17-val2)*val14*(1/sqrt((val18+1e-05f))))+val19);
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
    var val8 = temp0[alu37];
    var val9 = temp0[(alu37+1)];
    var val10 = temp0[(alu37+2)];
    var val11 = temp0[(alu37+3)];
    var val12 = temp0[(alu37+4)];
    var val13 = temp0[(alu37+5)];
    var val14 = temp0[(alu37+6)];
    acc1[0] = (acc1[0]+val8);
    acc1[1] = (acc1[1]+val9);
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
  var alu48 = ((bool(lidx0))!=true);
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

const E_128_49_4n2 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
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
  for (var Ridx0_0 = 0; Ridx0_0 < 1568; Ridx0_0++) {
    var alu1 = ((lidx0*1568)+Ridx0_0);
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
  var alu9 = ((bool(lidx0))!=true);
  if (alu9) {
    data0_512[gidx0] = (((acc1[0]+val3)-val4)*(1/sqrt((val5+1e-05f)))*0.1f);
  }
}`;

const setupNet = async (device, safetensor) => {
    const metadata = getTensorMetadata(safetensor);
    const infinityBuf = createInfinityUniformBuf(device);

    const layouts=[device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]})]

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
    const output0 = createEmptyBuf(device, 2048);;
    const buf_402 = createWeightBuf(device, 51380224, getTensorBuffer(safetensor, metadata['linear.weight']));
    const buf_403 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['linear.bias']));
    const buf_404 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['bn2.running_mean']));
    const buf_405 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['bn2.running_var']));

    const gpuWriteBuffer0 = device.createBuffer({size:input0.size, usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.MAP_WRITE });

    const gpuReadBuffer0 = device.createBuffer({size:output0.size, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });

    const kernels = [r_4_112_16_2_2_7_4_3_3_3, E_256_2, E_16_784_16_4, r_2_16_28_32_7_2_2_64_3_3, r_2_8_56_32_7_64_3_3, E_4_196_16_16, r_2_8_56_32_7_64_3_3n1, r_2_14_7_32_2_4_2_2_64_3_3, E_4_196_16_16, r_2_8_56_32_7_64_3_3n1, r_2_14_7_32_2_4_2_2_64_3_3, E_4_196_16_16, r_4_28_16_7_8_64, r_4_8_56_32_7_64_3_3, r_14_4_16_4_7_2_2_128_3_3, E_64_112_2_7, E_128_49_16, r_28_4_32_7_4_128_3_3, r_4_4_28_32_7_128_3_3, E_128_49_16, r_28_4_32_7_4_128_3_3, r_4_4_28_32_7_128_3_3, E_128_49_16, r_28_4_32_7_4_128_3_3, r_4_4_28_32_7_128_3_3, E_128_49_16, r_14_14_32_4_8_2_16, r_8_28_4_32_7_128_3_3, r_14_16_16_14_256_3_3, E_32_196_8, E_16_196_16, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_16_196_16, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_16_196_16, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_16_196_16, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_16_196_16, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_16_196_16, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_16_196_16, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_16_196_16, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_16_196_16, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_16_196_16, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_16_196_16, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_16_196_16, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_16_196_16, r_8_14_32_14_256_3_3, r_8_14_32_14_256_3_3n1, E_16_196_16, r_7_32_16_7_256, r_16_14_32_14_256_3_3, r_7_32_16_16_7_32_3_3, E_128_49_4, E_128_49_4n1, r_16_7_32_7_512_3_3, r_16_7_32_7_512_3_3n1, E_128_49_4n1, r_16_7_32_7_512_3_3, r_7_512_16_7_32_3_3, E_128_49_4n2, r_512_16_1568];
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
        addComputePass(device, commandEncoder, pipelines[0], layouts[0], infinityBuf, [buf_0, input0, buf_1, buf_2, buf_3, buf_4, buf_5, buf_6], [112, 4, 1]);
        addComputePass(device, commandEncoder, pipelines[1], layouts[1], infinityBuf, [buf_7, buf_8], [256, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[2], layouts[2], infinityBuf, [buf_9, buf_0, buf_10, buf_11, buf_12, buf_13], [784, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[3], layouts[3], infinityBuf, [buf_14, buf_9, buf_15, buf_16, buf_17, buf_18, buf_19, buf_20], [28, 16, 2]);
        addComputePass(device, commandEncoder, pipelines[4], layouts[4], infinityBuf, [buf_21, buf_14, buf_22, buf_23, buf_24, buf_25, buf_26, buf_0], [56, 8, 2]);
        addComputePass(device, commandEncoder, pipelines[5], layouts[5], infinityBuf, [buf_27, buf_21, buf_28, buf_29, buf_30, buf_31], [196, 4, 1]);
        addComputePass(device, commandEncoder, pipelines[6], layouts[6], infinityBuf, [buf_32, buf_27, buf_33, buf_34, buf_35, buf_36, buf_37, buf_38], [56, 8, 2]);
        addComputePass(device, commandEncoder, pipelines[7], layouts[7], infinityBuf, [buf_27, buf_32, buf_39, buf_40, buf_41, buf_42, buf_43, buf_21], [7, 14, 2]);
        addComputePass(device, commandEncoder, pipelines[8], layouts[8], infinityBuf, [buf_32, buf_27, buf_44, buf_45, buf_46, buf_47], [196, 4, 1]);
        addComputePass(device, commandEncoder, pipelines[9], layouts[9], infinityBuf, [buf_21, buf_32, buf_48, buf_49, buf_50, buf_51, buf_52, buf_53], [56, 8, 2]);
        addComputePass(device, commandEncoder, pipelines[10], layouts[10], infinityBuf, [buf_32, buf_21, buf_54, buf_55, buf_56, buf_57, buf_58, buf_27], [7, 14, 2]);
        addComputePass(device, commandEncoder, pipelines[11], layouts[11], infinityBuf, [buf_21, buf_32, buf_59, buf_60, buf_61, buf_62], [196, 4, 1]);
        addComputePass(device, commandEncoder, pipelines[12], layouts[12], infinityBuf, [buf_63, buf_32, buf_64, buf_65, buf_66, buf_67, buf_68], [28, 4, 1]);
        addComputePass(device, commandEncoder, pipelines[13], layouts[13], infinityBuf, [buf_69, buf_21, buf_70, buf_71, buf_72, buf_73, buf_74, buf_75], [56, 8, 4]);
        addComputePass(device, commandEncoder, pipelines[14], layouts[14], infinityBuf, [buf_76, buf_69, buf_77, buf_78, buf_79, buf_80, buf_81], [4, 14, 1]);
        addComputePass(device, commandEncoder, pipelines[15], layouts[15], infinityBuf, [buf_82, buf_76, buf_63], [112, 64, 1]);
        addComputePass(device, commandEncoder, pipelines[16], layouts[16], infinityBuf, [buf_76, buf_82, buf_83, buf_84, buf_85, buf_86], [49, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[17], layouts[17], infinityBuf, [buf_63, buf_76, buf_87, buf_88, buf_89, buf_90, buf_91, buf_92], [4, 28, 1]);
        addComputePass(device, commandEncoder, pipelines[18], layouts[18], infinityBuf, [buf_76, buf_63, buf_93, buf_94, buf_95, buf_96, buf_97, buf_82], [28, 4, 4]);
        addComputePass(device, commandEncoder, pipelines[19], layouts[19], infinityBuf, [buf_63, buf_76, buf_98, buf_99, buf_100, buf_101], [49, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[20], layouts[20], infinityBuf, [buf_82, buf_63, buf_102, buf_103, buf_104, buf_105, buf_106, buf_107], [4, 28, 1]);
        addComputePass(device, commandEncoder, pipelines[21], layouts[21], infinityBuf, [buf_63, buf_82, buf_108, buf_109, buf_110, buf_111, buf_112, buf_76], [28, 4, 4]);
        addComputePass(device, commandEncoder, pipelines[22], layouts[22], infinityBuf, [buf_82, buf_63, buf_113, buf_114, buf_115, buf_116], [49, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[23], layouts[23], infinityBuf, [buf_76, buf_82, buf_117, buf_118, buf_119, buf_120, buf_121, buf_122], [4, 28, 1]);
        addComputePass(device, commandEncoder, pipelines[24], layouts[24], infinityBuf, [buf_82, buf_76, buf_123, buf_124, buf_125, buf_126, buf_127, buf_63], [28, 4, 4]);
        addComputePass(device, commandEncoder, pipelines[25], layouts[25], infinityBuf, [buf_76, buf_82, buf_128, buf_129, buf_130, buf_131], [49, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[26], layouts[26], infinityBuf, [buf_132, buf_82, buf_133, buf_134, buf_135, buf_136, buf_137], [32, 14, 14]);
        addComputePass(device, commandEncoder, pipelines[27], layouts[27], infinityBuf, [buf_21, buf_76, buf_138, buf_139, buf_140, buf_141, buf_142, buf_143], [4, 28, 8]);
        addComputePass(device, commandEncoder, pipelines[28], layouts[28], infinityBuf, [buf_144, buf_21, buf_145, buf_146, buf_147, buf_148, buf_149], [16, 14, 1]);
        addComputePass(device, commandEncoder, pipelines[29], layouts[29], infinityBuf, [buf_150, buf_144, buf_132], [196, 32, 1]);
        addComputePass(device, commandEncoder, pipelines[30], layouts[30], infinityBuf, [buf_144, buf_150, buf_151, buf_152, buf_153, buf_154], [196, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[31], layouts[31], infinityBuf, [buf_132, buf_144, buf_155, buf_156, buf_157, buf_158, buf_159, buf_160], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[32], layouts[32], infinityBuf, [buf_144, buf_132, buf_161, buf_162, buf_163, buf_164, buf_165, buf_150], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[33], layouts[33], infinityBuf, [buf_132, buf_144, buf_166, buf_167, buf_168, buf_169], [196, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[34], layouts[34], infinityBuf, [buf_150, buf_132, buf_170, buf_171, buf_172, buf_173, buf_174, buf_175], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[35], layouts[35], infinityBuf, [buf_132, buf_150, buf_176, buf_177, buf_178, buf_179, buf_180, buf_144], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[36], layouts[36], infinityBuf, [buf_150, buf_132, buf_181, buf_182, buf_183, buf_184], [196, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[37], layouts[37], infinityBuf, [buf_144, buf_150, buf_185, buf_186, buf_187, buf_188, buf_189, buf_190], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[38], layouts[38], infinityBuf, [buf_150, buf_144, buf_191, buf_192, buf_193, buf_194, buf_195, buf_132], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[39], layouts[39], infinityBuf, [buf_144, buf_150, buf_196, buf_197, buf_198, buf_199], [196, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[40], layouts[40], infinityBuf, [buf_132, buf_144, buf_200, buf_201, buf_202, buf_203, buf_204, buf_205], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[41], layouts[41], infinityBuf, [buf_144, buf_132, buf_206, buf_207, buf_208, buf_209, buf_210, buf_150], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[42], layouts[42], infinityBuf, [buf_132, buf_144, buf_211, buf_212, buf_213, buf_214], [196, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[43], layouts[43], infinityBuf, [buf_150, buf_132, buf_215, buf_216, buf_217, buf_218, buf_219, buf_220], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[44], layouts[44], infinityBuf, [buf_132, buf_150, buf_221, buf_222, buf_223, buf_224, buf_225, buf_144], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[45], layouts[45], infinityBuf, [buf_150, buf_132, buf_226, buf_227, buf_228, buf_229], [196, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[46], layouts[46], infinityBuf, [buf_144, buf_150, buf_230, buf_231, buf_232, buf_233, buf_234, buf_235], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[47], layouts[47], infinityBuf, [buf_150, buf_144, buf_236, buf_237, buf_238, buf_239, buf_240, buf_132], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[48], layouts[48], infinityBuf, [buf_144, buf_150, buf_241, buf_242, buf_243, buf_244], [196, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[49], layouts[49], infinityBuf, [buf_132, buf_144, buf_245, buf_246, buf_247, buf_248, buf_249, buf_250], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[50], layouts[50], infinityBuf, [buf_144, buf_132, buf_251, buf_252, buf_253, buf_254, buf_255, buf_150], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[51], layouts[51], infinityBuf, [buf_132, buf_144, buf_256, buf_257, buf_258, buf_259], [196, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[52], layouts[52], infinityBuf, [buf_150, buf_132, buf_260, buf_261, buf_262, buf_263, buf_264, buf_265], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[53], layouts[53], infinityBuf, [buf_132, buf_150, buf_266, buf_267, buf_268, buf_269, buf_270, buf_144], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[54], layouts[54], infinityBuf, [buf_150, buf_132, buf_271, buf_272, buf_273, buf_274], [196, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[55], layouts[55], infinityBuf, [buf_144, buf_150, buf_275, buf_276, buf_277, buf_278, buf_279, buf_280], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[56], layouts[56], infinityBuf, [buf_150, buf_144, buf_281, buf_282, buf_283, buf_284, buf_285, buf_132], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[57], layouts[57], infinityBuf, [buf_144, buf_150, buf_286, buf_287, buf_288, buf_289], [196, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[58], layouts[58], infinityBuf, [buf_132, buf_144, buf_290, buf_291, buf_292, buf_293, buf_294, buf_295], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[59], layouts[59], infinityBuf, [buf_144, buf_132, buf_296, buf_297, buf_298, buf_299, buf_300, buf_150], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[60], layouts[60], infinityBuf, [buf_132, buf_144, buf_301, buf_302, buf_303, buf_304], [196, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[61], layouts[61], infinityBuf, [buf_150, buf_132, buf_305, buf_306, buf_307, buf_308, buf_309, buf_310], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[62], layouts[62], infinityBuf, [buf_132, buf_150, buf_311, buf_312, buf_313, buf_314, buf_315, buf_144], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[63], layouts[63], infinityBuf, [buf_150, buf_132, buf_316, buf_317, buf_318, buf_319], [196, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[64], layouts[64], infinityBuf, [buf_144, buf_150, buf_320, buf_321, buf_322, buf_323, buf_324, buf_325], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[65], layouts[65], infinityBuf, [buf_150, buf_144, buf_326, buf_327, buf_328, buf_329, buf_330, buf_132], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[66], layouts[66], infinityBuf, [buf_144, buf_150, buf_331, buf_332, buf_333, buf_334], [196, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[67], layouts[67], infinityBuf, [buf_132, buf_144, buf_335, buf_336, buf_337, buf_338, buf_339, buf_340], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[68], layouts[68], infinityBuf, [buf_144, buf_132, buf_341, buf_342, buf_343, buf_344, buf_345, buf_150], [14, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[69], layouts[69], infinityBuf, [buf_132, buf_144, buf_346, buf_347, buf_348, buf_349], [196, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[70], layouts[70], infinityBuf, [buf_350, buf_144, buf_351, buf_352, buf_353, buf_354, buf_355], [32, 7, 1]);
        addComputePass(device, commandEncoder, pipelines[71], layouts[71], infinityBuf, [buf_76, buf_132, buf_356, buf_357, buf_358, buf_359, buf_360, buf_361], [14, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[72], layouts[72], infinityBuf, [buf_362, buf_76, buf_363, buf_364, buf_365, buf_366, buf_367], [32, 7, 1]);
        addComputePass(device, commandEncoder, pipelines[73], layouts[73], infinityBuf, [buf_368, buf_362, buf_350], [49, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[74], layouts[74], infinityBuf, [buf_362, buf_368, buf_369, buf_370, buf_371, buf_372], [49, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[75], layouts[75], infinityBuf, [buf_350, buf_362, buf_373, buf_374, buf_375, buf_376, buf_377, buf_378], [7, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[76], layouts[76], infinityBuf, [buf_362, buf_350, buf_379, buf_380, buf_381, buf_382, buf_383, buf_368], [7, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[77], layouts[77], infinityBuf, [buf_350, buf_362, buf_384, buf_385, buf_386, buf_387], [49, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[78], layouts[78], infinityBuf, [buf_368, buf_350, buf_388, buf_389, buf_390, buf_391, buf_392, buf_393], [7, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[79], layouts[79], infinityBuf, [buf_350, buf_368, buf_394, buf_395, buf_396, buf_397, buf_398, buf_362], [512, 7, 1]);
        addComputePass(device, commandEncoder, pipelines[80], layouts[80], infinityBuf, [buf_368, buf_350, buf_7, buf_399, buf_400, buf_401], [49, 128, 1]);
        addComputePass(device, commandEncoder, pipelines[81], layouts[81], infinityBuf, [output0, buf_368, buf_402, buf_403, buf_404, buf_405], [512, 1, 1]);
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
