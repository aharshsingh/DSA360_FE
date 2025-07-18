"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// Types
interface Uniforms {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
}

interface ShaderProps {
  source: string;
  uniforms: Uniforms;
  maxFps?: number;
}

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  reverse?: boolean;
}) => {
  return (
    <div className={cn("h-full relative w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors}
          dotSize={dotSize ?? 3}
          opacities={opacities}
          shader={`
            ${reverse ? "u_reverse_active" : "false"}_;
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      )}
    </div>
  );
};

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = "",
}) => {
  const uniforms = useMemo(() => {
    const colorsArray = colors.length >= 3
      ? [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]]
      : colors.length === 2
      ? [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1]]
      : [colors[0], colors[0], colors[0], colors[0], colors[0], colors[0]];

    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
      u_reverse: {
        value: shader.includes("u_reverse_active") ? 1 : 0,
        type: "uniform1i",
      },
    };
  }, [colors, opacities, totalSize, dotSize, shader]);

  return (
    <Shader
  source={`
    precision mediump float;
    in vec2 fragCoord;

    uniform float u_time;
    uniform float u_opacities[10];
    uniform vec3 u_colors[6];
    uniform float u_total_size;
    uniform float u_dot_size;
    uniform vec2 u_resolution;
    uniform int u_reverse;

    out vec4 fragColor;

    float PHI = 1.61803398874989484820459;
    float random(vec2 xy) {
        return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
    }

    void main() {
        vec2 st = fragCoord.xy;

        st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));
        st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));

        float opacity = step(0.0, st.x) * step(0.0, st.y);

        vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));
        float frequency = 5.0;
        float show_offset = random(st2);
        float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
        opacity *= u_opacities[int(rand * 10.0)];
        opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
        opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

        vec3 color = u_colors[int(show_offset * 6.0)];

        float animation_speed_factor = 0.5;
        vec2 center_grid = u_resolution / 2.0 / u_total_size;
        float dist_from_center = distance(center_grid, st2);
        float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);
        float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
        float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);

        float current_timing_offset;
        if (u_reverse == 1) {
            current_timing_offset = timing_offset_outro;
            opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
            opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
        } else {
            current_timing_offset = timing_offset_intro;
            opacity *= step(current_timing_offset, u_time * animation_speed_factor);
            opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
        }

        fragColor = vec4(color, opacity);
        fragColor.rgb *= fragColor.a;
    }
  `}
  uniforms={uniforms}
  maxFps={60}
/>

  );
};

const ShaderMaterial = ({
  source,
  uniforms,
}: ShaderProps) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();
    const material: any = ref.current.material;
    if (material.uniforms.u_time) material.uniforms.u_time.value = timestamp;
  });

  const preparedUniforms = useMemo(() => {
    const u: any = {};
    for (const k in uniforms) {
      const val = uniforms[k];
      u[k] = val.type.includes("3")
        ? { value: val.value.map((v: number[]) => new THREE.Vector3().fromArray(v)) }
        : { value: val.value };
    }
    u["u_time"] = { value: 0 };
    u["u_resolution"] = { value: new THREE.Vector2(size.width * 2, size.height * 2) };
    return u;
  }, [uniforms, size]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        gl_Position = vec4(position, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }`,
    fragmentShader: source,
    uniforms: preparedUniforms,
    glslVersion: THREE.GLSL3,
    blending: THREE.CustomBlending,
    blendSrc: THREE.SrcAlphaFactor,
    blendDst: THREE.OneFactor,
  }), [source, preparedUniforms]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};
