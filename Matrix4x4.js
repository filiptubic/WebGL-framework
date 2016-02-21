/**
 * Matrix4x4
 */
/// <reference path="Vector3D" />
var Matrix4x4 = (function () {
    function Matrix4x4() {
        this.m_d = new Array(4);
        for (var index = 0; index < this.m_d.length; index++) {
            this.m_d[index] = new Array(4);
        }
        this.zero();
    }
    Matrix4x4.prototype.zero = function () {
        for (var i = 0; i < this.m_d.length; i++) {
            for (var j = 0; j < this.m_d[i].length; j++) {
                this.m_d[i][j] = 0;
            }
        }
    };
    Matrix4x4.prototype.identity = function () {
        for (var i = 0; i < this.m_d.length; i++) {
            for (var j = 0; j < this.m_d[i].length; j++) {
                if (i != j)
                    this.m_d[i][j] = 0;
                else
                    this.m_d[i][j] = 1;
            }
        }
    };
    Matrix4x4.prototype.transpose = function () {
        for (var i = 0; i < this.m_d.length; i++) {
            for (var j = 0; j < this.m_d.length; j++) {
                var t = this.m_d[i][j];
                this.m_d[i][j] = this.m_d[j][i];
                this.m_d[j][i] = t;
            }
        }
    };
    Matrix4x4.det2x2 = function (a, b, c, d) {
        return ((a * d) - (b * c));
    };
    Matrix4x4.det3x3 = function (a1, a2, a3, b1, b2, b3, c1, c2, c3) {
        return (a1 * Matrix4x4.det2x2(b2, b3, c2, c3) -
            b1 * Matrix4x4.det2x2(a2, a3, c2, c3) +
            c1 * Matrix4x4.det2x2(a2, a3, b2, b3));
    };
    Matrix4x4.prototype.det = function () {
        var a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, d1, d2, d3, d4;
        a1 = this.m_d[0][0];
        c1 = this.m_d[2][0];
        d1 = this.m_d[3][0];
        b1 = this.m_d[1][0];
        a2 = this.m_d[0][1];
        b2 = this.m_d[1][1];
        c2 = this.m_d[2][1];
        d2 = this.m_d[3][1];
        a3 = this.m_d[0][2];
        b3 = this.m_d[1][2];
        c3 = this.m_d[2][2];
        d3 = this.m_d[3][2];
        a4 = this.m_d[0][3];
        b4 = this.m_d[1][3];
        c4 = this.m_d[2][3];
        d4 = this.m_d[3][3];
        return (a1 * Matrix4x4.det3x3(b2, b3, b4, c2, c3, c4, d2, d3, d4) -
            b1 * Matrix4x4.det3x3(a2, a3, a4, c2, c3, c4, d2, d3, d4) +
            c1 * Matrix4x4.det3x3(a2, a3, a4, b2, b3, b4, d2, d3, d4) -
            d1 * Matrix4x4.det3x3(a2, a3, a4, b2, b3, b4, c2, c3, c4));
    };
    Matrix4x4.prototype.adjoint = function () {
        var a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, d1, d2, d3, d4;
        a1 = this.m_d[0][0];
        b1 = this.m_d[1][0];
        c1 = this.m_d[2][0];
        d1 = this.m_d[3][0];
        a2 = this.m_d[0][1];
        b2 = this.m_d[1][1];
        c2 = this.m_d[2][1];
        d2 = this.m_d[3][1];
        a3 = this.m_d[0][2];
        b3 = this.m_d[1][2];
        c3 = this.m_d[2][2];
        d3 = this.m_d[3][2];
        a4 = this.m_d[0][3];
        b4 = this.m_d[1][3];
        c4 = this.m_d[2][3];
        d4 = this.m_d[3][3];
        this.m_d[0][0] = Matrix4x4.det3x3(b2, b3, b4, c2, c3, c4, d2, d3, d4);
        this.m_d[0][1] = -Matrix4x4.det3x3(a2, a3, a4, c2, c3, c4, d2, d3, d4);
        this.m_d[0][2] = Matrix4x4.det3x3(a2, a3, a4, b2, b3, b4, d2, d3, d4);
        this.m_d[0][3] = -Matrix4x4.det3x3(a2, a3, a4, b2, b3, b4, c2, c3, c4);
        this.m_d[1][0] = -Matrix4x4.det3x3(b1, b3, b4, c1, c3, c4, d1, d3, d4);
        this.m_d[1][1] = Matrix4x4.det3x3(a1, a3, a4, c1, c3, c4, d1, d3, d4);
        this.m_d[1][2] = -Matrix4x4.det3x3(a1, a3, a4, b1, b3, b4, d1, d3, d4);
        this.m_d[1][3] = Matrix4x4.det3x3(a1, a3, a4, b1, b3, b4, c1, c3, c4);
        this.m_d[2][0] = Matrix4x4.det3x3(b1, b2, b4, c1, c2, c4, d1, d2, d4);
        this.m_d[2][1] = -Matrix4x4.det3x3(a1, a2, a4, c1, c2, c4, d1, d2, d4);
        this.m_d[2][2] = Matrix4x4.det3x3(a1, a2, a4, b1, b2, b4, d1, d2, d4);
        this.m_d[2][3] = -Matrix4x4.det3x3(a1, a2, a4, b1, b2, b4, c1, c2, c4);
        this.m_d[3][0] = -Matrix4x4.det3x3(b1, b2, b3, c1, c2, c3, d1, d2, d3);
        this.m_d[3][1] = Matrix4x4.det3x3(a1, a2, a3, c1, c2, c3, d1, d2, d3);
        this.m_d[3][2] = -Matrix4x4.det3x3(a1, a2, a3, b1, b2, b3, d1, d2, d3);
        this.m_d[3][3] = Matrix4x4.det3x3(a1, a2, a3, b1, b2, b3, c1, c2, c3);
    };
    Matrix4x4.prototype.copy = function (A) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                this.m_d[i][j] = A.m_d[i][j];
            }
        }
    };
    Matrix4x4.prototype.opSubstractByMatrix = function (matrix) {
        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++)
                this.m_d[i][j] = this.m_d[i][j] - matrix.m_d[i][j];
    };
    Matrix4x4.prototype.opConcayByMatrix = function (matrix) {
        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++)
                this.m_d[i][j] = this.m_d[i][j] + matrix.m_d[i][j];
    };
    Matrix4x4.prototype.opMultiplyByScalar = function (scalar) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                this.m_d[i][j] = this.m_d[i][j] * scalar;
            }
        }
    };
    Matrix4x4.prototype.opMultiplyByMatrix = function (matrix) {
        var ab;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                ab = 0.0;
                for (var k = 0; k < 4; k++)
                    ab += this.m_d[i][k] * matrix.m_d[k][j];
                this.m_d[i][j] = ab;
            }
        }
    };
    Matrix4x4.prototype.inv = function () {
        var determinant = this.det();
        if (determinant < Matrix4x4.EPSILON)
            return false;
        var A = new Matrix4x4();
        A.copy(this);
        A.adjoint();
        A.opMultiplyByScalar(determinant);
        this.copy(A);
        return true;
    };
    Matrix4x4.prototype.loadTranslate = function (tx, ty, tz) {
        this.identity();
        this.m_d[0][3] = tx;
        this.m_d[1][3] = ty;
        this.m_d[2][3] = tz;
    };
    Matrix4x4.prototype.loadScale = function (sx, sy, sz) {
        this.identity();
        this.m_d[0][0] = sx;
        this.m_d[1][1] = sy;
        this.m_d[2][2] = sz;
    };
    Matrix4x4.prototype.loadRotateX = function (phi) {
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);
        this.zero();
        this.m_d[0][0] = 1.0;
        this.m_d[1][1] = cosPhi;
        this.m_d[2][2] = cosPhi;
        this.m_d[1][2] = -sinPhi;
        this.m_d[2][1] = sinPhi;
        this.m_d[3][3] = 1.0;
    };
    Matrix4x4.prototype.loadRotateY = function (phi) {
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);
        this.zero();
        this.m_d[0][0] = cosPhi;
        this.m_d[1][1] = 1.0;
        this.m_d[2][2] = cosPhi;
        this.m_d[0][2] = sinPhi;
        this.m_d[2][0] = -sinPhi;
        this.m_d[3][3] = 1.0;
    };
    Matrix4x4.prototype.loadRotateZ = function (phi) {
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);
        this.zero();
        this.m_d[0][0] = cosPhi;
        this.m_d[1][1] = cosPhi;
        this.m_d[2][2] = 1.0;
        this.m_d[0][1] = -sinPhi;
        this.m_d[1][0] = sinPhi;
        this.m_d[3][3] = 1.0;
    };
    Matrix4x4.prototype.loadRotateAboutAxisThroughOrigin = function (V, phi) {
        this.zero();
        this.m_d[3][3] = 1.0;
        var cos_phi = Math.cos(phi);
        var sin_phi = Math.sin(phi);
        var t = 1.0 - cos_phi;
        var VN = new Vector3D();
        VN.Copy(V);
        VN.Normalize();
        this.m_d[0][0] = VN.m_x * VN.m_x * t + cos_phi;
        this.m_d[0][1] = VN.m_y * VN.m_y * t - VN.m_z * sin_phi;
        this.m_d[0][2] = VN.m_z * VN.m_z * t + VN.m_y * sin_phi;
        this.m_d[1][0] = VN.m_x * VN.m_y * t + VN.m_z * sin_phi;
        this.m_d[1][1] = VN.m_y * VN.m_y * t + cos_phi;
        this.m_d[1][2] = VN.m_y * VN.m_z * t - VN.m_x * sin_phi;
        this.m_d[2][0] = VN.m_x * VN.m_z * t - VN.m_y * sin_phi;
        this.m_d[2][1] = VN.m_y * VN.m_z * t + VN.m_x * sin_phi;
        this.m_d[2][2] = VN.m_z * VN.m_z * t + cos_phi;
    };
    Matrix4x4.prototype.loadRotate = function (point, axis, phi) {
        var axis_norm = new Vector3D();
        axis_norm.Copy(axis);
        axis_norm.Normalize();
        var a = point.m_x;
        var b = point.m_y;
        var c = point.m_z;
        var u = axis_norm.m_x;
        var v = axis_norm.m_y;
        var w = axis_norm.m_z;
        var cos_phi = Math.cos(phi);
        var sin_phi = Math.sin(phi);
        var t = 1.0 - cos_phi;
        this.identity();
        this.m_d[0][0] = u * u + (v * v + w * w) * cos_phi;
        this.m_d[0][1] = u * v * t - w * sin_phi;
        this.m_d[0][2] = u * w * t + v * sin_phi;
        this.m_d[0][3] = (a * (v * v + w * w) - u * (b * v + c * w)) * t + (b * w - c * v) * sin_phi;
        this.m_d[1][0] = u * v * t + w * sin_phi;
        this.m_d[1][1] = v * v + (u * u + w * w) * cos_phi;
        this.m_d[1][2] = v * w * t - u * sin_phi;
        this.m_d[1][3] = (b * (u * u + w * w) - v * (a * u + c * w)) * t + (c * u - a * w) * sin_phi;
        this.m_d[2][0] = u * w * t - v * sin_phi;
        this.m_d[2][1] = v * w * t + u * sin_phi;
        this.m_d[2][2] = w * w + (u * u + v * v) * cos_phi;
        this.m_d[2][3] = (c * (u * u + v * v) - w * (a * u + b * v)) * t + (a * v - b * u) * sin_phi;
    };
    Matrix4x4.prototype.opMultiplyByVector3D = function (A) {
        var v = new Vector3D();
        v.m_x = this.m_d[0][0] * A.m_x + this.m_d[0][1] * A.m_y + this.m_d[0][2] * A.m_z + this.m_d[0][3];
        v.m_y = this.m_d[1][0] * A.m_x + this.m_d[1][1] * A.m_y + this.m_d[1][2] * A.m_z + this.m_d[1][3];
        v.m_z = this.m_d[2][0] * A.m_x + this.m_d[2][1] * A.m_y + this.m_d[2][2] * A.m_z + this.m_d[2][3];
        return v;
    };
    Matrix4x4.prototype.Transform = function (A) {
        var v = new Vector3D();
        var x = A.m_x;
        var y = A.m_y;
        var z = A.m_z;
        v.m_x = this.m_d[0][0] * x + this.m_d[0][1] * y + this.m_d[0][2] * z + this.m_d[0][3];
        v.m_y = this.m_d[1][0] * x + this.m_d[1][1] * y + this.m_d[1][2] * z + this.m_d[1][3];
        v.m_z = this.m_d[2][0] * x + this.m_d[2][1] * y + this.m_d[2][2] * z + this.m_d[2][3];
        return (v);
    };
    Matrix4x4.prototype.Translate = function (A) {
        var v = new Vector3D();
        v.Set(this.m_d[0][3], this.m_d[1][3], this.m_d[2][3]);
        v.opConcatByVector3D(A);
        return v;
    };
    Matrix4x4.prototype.flatten = function () {
        var result = [];
        if (this.m_d.length === 0)
            return [];
        for (var j = 0; j < this.m_d[0].length; j++)
            for (var i = 0; i < this.m_d.length; i++)
                result.push(this.m_d[i][j]);
        return result;
    };
    ;
    Matrix4x4.Copy = function (matrix) {
        var matrixCopy = new Matrix4x4();
        matrixCopy.copy(matrix);
        return matrixCopy;
    };
    Matrix4x4.makePerspective = function (fovy, aspect, znear, zfar) {
        var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
        var ymin = -ymax;
        var xmin = ymin * aspect;
        var xmax = ymax * aspect;
        return Matrix4x4.makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
    };
    Matrix4x4.makeFrustum = function (left, right, bottom, top, znear, zfar) {
        var X = 2 * znear / (right - left);
        var Y = 2 * znear / (top - bottom);
        var A = (right + left) / (right - left);
        var B = (top + bottom) / (top - bottom);
        var C = -(zfar + znear) / (zfar - znear);
        var D = -2 * zfar * znear / (zfar - znear);
        var fm = new Matrix4x4();
        fm.m_d[0][0] = X;
        fm.m_d[0][1] = 0;
        fm.m_d[0][2] = A;
        fm.m_d[0][3] = 0;
        fm.m_d[1][0] = 0;
        fm.m_d[1][1] = Y;
        fm.m_d[1][2] = B;
        fm.m_d[1][3] = 0;
        fm.m_d[2][0] = 0;
        fm.m_d[2][1] = 0;
        fm.m_d[2][2] = C;
        fm.m_d[2][3] = D;
        fm.m_d[3][0] = 0;
        fm.m_d[3][1] = 0;
        fm.m_d[3][2] = -1;
        fm.m_d[3][3] = 0;
        return fm;
    };
    Matrix4x4.makeOrtho = function (left, right, bottom, top, znear, zfar) {
        var tx = -(right + left) / (right - left);
        var ty = -(top + bottom) / (top - bottom);
        var tz = -(zfar + znear) / (zfar - znear);
        var om = new Matrix4x4();
        om.m_d[0][0] = 2 / (right - left);
        om.m_d[0][1] = 0;
        om.m_d[0][2] = 0;
        om.m_d[0][3] = tx;
        om.m_d[1][0] = 0;
        om.m_d[1][1] = 2 / (top - bottom);
        om.m_d[1][2] = 0;
        om.m_d[1][3] = ty;
        om.m_d[2][0] = 0;
        om.m_d[2][1] = 0;
        om.m_d[2][2] = -2 / (zfar - znear);
        om.m_d[2][3] = tz;
        om.m_d[3][0] = 0;
        om.m_d[3][1] = 0;
        om.m_d[3][2] = 0;
        om.m_d[3][3] = 1;
        return om;
    };
    Matrix4x4.makeLookAt = function (ex, ey, ez, cx, cy, cz, ux, uy, uz) {
        var eye = new Vector3D();
        eye.Init(ex, ey, ez);
        var center = new Vector3D();
        center.Init(cx, cy, cz);
        var up = new Vector3D();
        up.Init(ux, uy, uz);
        var z = new Vector3D();
        z.Copy(eye);
        z.opSubstractByVector3D(center);
        z.Normalize();
        var x = new Vector3D();
        x.Copy(up);
        x = x.Cross(z);
        x.Normalize();
        var y = new Vector3D();
        y.Copy(z);
        y = y.Cross(x);
        y.Normalize();
        var m = new Matrix4x4();
        m.identity();
        m.m_d[0][0] = x.m_x;
        m.m_d[0][1] = x.m_y;
        m.m_d[0][2] = x.m_z;
        m.m_d[0][3] = 0;
        m.m_d[1][0] = y.m_x;
        m.m_d[1][1] = y.m_y;
        m.m_d[1][2] = y.m_z;
        m.m_d[1][3] = 0;
        m.m_d[2][0] = z.m_x;
        m.m_d[2][1] = z.m_y;
        m.m_d[2][2] = z.m_z;
        m.m_d[2][3] = 0;
        m.m_d[3][0] = 0;
        m.m_d[3][1] = 0;
        m.m_d[3][2] = 0;
        m.m_d[3][3] = 1;
        var t = new Matrix4x4();
        t.loadTranslate(-ex, -ey, -ez);
        m.opMultiplyByMatrix(t);
        return m;
    };
    Matrix4x4.EPSILON = 1.0e-10;
    return Matrix4x4;
})();
