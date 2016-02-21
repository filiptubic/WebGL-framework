/**
 * Vector3D
 */
var Vector3D = (function () {
    function Vector3D() {
        this.zero();
    }
    Vector3D.prototype.Set = function (x, y, z) {
        this.m_x = x;
        this.m_y = y;
        this.m_z = z;
    };
    Vector3D.prototype.Init = function (x, y, z) {
        this.Set(x, y, z);
    };
    Vector3D.prototype.zero = function () {
        this.m_x = 0.0;
        this.m_y = 0.0;
        this.m_z = 0.0;
    };
    Vector3D.prototype.Copy = function (A) {
        this.m_x = A.m_x;
        this.m_y = A.m_y;
        this.m_z = A.m_z;
    };
    Vector3D.prototype.DistSqr = function (A) {
        return (this.m_x - A.m_x) * (this.m_x - A.m_x) + (this.m_y - A.m_y) * (this.m_y - A.m_y) + (this.m_z - A.m_z) * (this.m_z - A.m_z);
    };
    Vector3D.prototype.Dist = function (A) {
        return Math.sqrt(this.DistSqr(A));
    };
    Vector3D.prototype.Norm = function () {
        return Math.sqrt(this.NormSqr());
    };
    Vector3D.prototype.NormSqr = function () {
        return this.m_x * this.m_x + this.m_y * this.m_y + this.m_z * this.m_z;
    };
    Vector3D.prototype.Cross = function (v) {
        var A = new Vector3D();
        A.m_x = this.m_y * v.m_z - this.m_z * v.m_y;
        A.m_y = this.m_z * v.m_x - this.m_x * v.m_z;
        A.m_z = this.m_x * v.m_y - this.m_y * v.m_x;
        return A;
    };
    Vector3D.prototype.opConcatByVector3D = function (A) {
        this.m_x += A.m_x;
        this.m_y += A.m_y;
        this.m_z += A.m_z;
    };
    Vector3D.prototype.opSubstractByVector3D = function (A) {
        this.m_x -= A.m_x;
        this.m_y -= A.m_y;
        this.m_z -= A.m_z;
    };
    Vector3D.prototype.opMultiplyByScalar = function (k) {
        this.m_x *= k;
        this.m_y *= k;
        this.m_z *= k;
    };
    Vector3D.prototype.Normalize = function () {
        var norm = this.Norm();
        if (norm <= Vector3D.EPSILON) {
            this.zero();
        }
        else {
            this.m_x /= norm;
            this.m_y /= norm;
            this.m_z /= norm;
        }
    };
    Vector3D.prototype.add = function (A, B) {
        this.m_x = A.m_x + B.m_x;
        this.m_y = A.m_y + B.m_y;
        this.m_z = A.m_z + B.m_z;
    };
    Vector3D.prototype.sub = function (A, B) {
        this.m_x = A.m_x - B.m_x;
        this.m_y = A.m_y - B.m_y;
        this.m_z = A.m_z - B.m_z;
    };
    Vector3D.prototype.cross = function (A, B) {
        this.m_x = A.m_y * B.m_z - A.m_z * B.m_y;
        this.m_y = A.m_z * B.m_x - A.m_x * B.m_z;
        this.m_z = A.m_x * B.m_y - A.m_y * B.m_x;
    };
    Vector3D.prototype.normal = function (A, B, C) {
        var P;
        var Q;
        P.sub(C, B);
        Q.sub(A, B);
        this.cross(P, Q);
        this.Normalize();
    };
    Vector3D.EPSILON = 1.0e-10;
    return Vector3D;
})();
