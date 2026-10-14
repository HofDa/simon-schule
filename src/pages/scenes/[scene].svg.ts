/**
 * The learning scenes as standalone SVG files (/scenes/<name>.svg), generated at build time,
 * so the browser can cache them and load them only when the section comes near.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { sceneNames, sceneSvg, type SceneName } from '../../components/whiteboard/art/learning-scenes';

export const getStaticPaths = (() => sceneNames.map((scene) => ({ params: { scene } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) =>
  new Response(sceneSvg(params.scene as SceneName), { headers: { 'Content-Type': 'image/svg+xml' } });
